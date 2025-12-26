const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// --- CONFIGURAÇÃO DE LOGIN AUTOMÁTICO ---
const ML_EMAIL = process.env.ML_EMAIL;
const ML_SENHA = process.env.ML_SENHA;
// ----------------------------------------

// --- CONFIGURAÇÃO DE PROXY ---
// Preencha aqui se precisar usar proxy. Ex: 'http://123.123.123.123:8080'
const proxyServer = process.env.PROXY_SERVER || '';
const proxyUsername = process.env.PROXY_USERNAME || '';
const proxyPassword = process.env.PROXY_PASSWORD || '';
// -----------------------------

// 1. Captura os links passados via linha de comando
const linksParaGerar = process.argv.slice(2);

if (linksParaGerar.length === 0) {
    console.error('❌ Erro: Nenhum link fornecido.');
    console.error('👉 Uso: node geradorDeLinks.js https://produto1... https://produto2...');
    process.exit(1);
}

(async () => {
    console.log('🚀 Iniciando o gerador de links...');

    // 2. Configuração do Browser
    const launchArgs = [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ];
    if (proxyServer) {
        launchArgs.push(`--proxy-server=${proxyServer}`);
        console.log(`🔌 Usando proxy: ${proxyServer}`);
    }

    const browser = await puppeteer.launch({
        headless: false, // false para você ver o navegador abrindo
        defaultViewport: null,
        args: launchArgs,
        // IMPORTANTE: Salva a sessão na pasta 'sessao_ml' para manter o login
        userDataDir: path.join(__dirname, 'sessao_ml')
    });

    const page = await browser.newPage();

    if (proxyServer && proxyUsername) {
        console.log(`🔒 Autenticando no proxy com o usuário: ${proxyUsername}`);
        await page.authenticate({ username: proxyUsername, password: proxyPassword });
    }

    // URL atualizada conforme sua solicitação
    const URL_FERRAMENTA_AFILIADO = 'https://www.mercadolivre.com.br/afiliados/linkbuilder#hub'; 
    
    try {
        // Navega para a página de afiliados e verifica se o login é necessário.
        await page.goto(URL_FERRAMENTA_AFILIADO, { waitUntil: 'networkidle2' });

        // Se a URL atual não for a de afiliados, o script assume que um login é necessário.
        if (!page.url().includes('afiliados')) {
            console.log('⚠️  Parece que você não está logado.');

            // Lógica de Login Automático
            if (ML_EMAIL && ML_SENHA) {
                console.log('🤖 Tentando login automático...');
                try {
                    // 1. Preencher Email
                    const selEmail = 'input[name="user_id"]';
                    if (await page.$(selEmail)) {
                        await page.type(selEmail, ML_EMAIL, { delay: 50 });
                        await page.keyboard.press('Enter');
                        await new Promise(r => setTimeout(r, 3000)); // Espera animação
                    }

                    // 2. Preencher Senha
                    const selSenha = 'input[name="password"]';
                    try {
                        await page.waitForSelector(selSenha, { timeout: 5000 });
                        await page.type(selSenha, ML_SENHA, { delay: 50 });
                        await page.keyboard.press('Enter');
                    } catch (e) {
                        console.log('   (Campo de senha não apareceu automaticamente. Pode ser CAPTCHA ou 2FA)');
                    }
                } catch (err) {
                    console.error('   Erro ao tentar login automático:', err.message);
                }
            }

            // Se o login automático não estiver configurado ou falhar, aguarda o login manual.
            if (!page.url().includes('afiliados')) {
                 if (!ML_EMAIL || !ML_SENHA) {
                    console.log('👉 Para login automático, preencha o arquivo .env com ML_EMAIL e ML_SENHA.');
                }
                console.log('👉 Por favor, faça login manualmente no navegador aberto.');
                console.log('⏳ O script aguardará até você entrar na página de afiliados...');
                
                // Aguarda infinitamente até a URL conter "afiliados" novamente
                await page.waitForFunction(
                    () => window.location.href.includes('afiliados'),
                    { timeout: 0 } 
                );
            }
             console.log('✅ Login detectado! Continuando...');
        } else {
            console.log('✅ Já está logado. Continuando...');
        }

        console.log(`📋 Processando ${linksParaGerar.length} links...\n`);

        // Gera um arquivo HTML inicial para ajudar a identificar seletores
        // fs.writeFileSync('debug_layout.html', await page.content());
        // console.log('🐛 Arquivo "debug_layout.html" salvo. Use-o para inspecionar os seletores se precisar.\n');

        for (const linkOriginal of linksParaGerar) {
            try {
                // Recarrega a página para garantir que a lista de links esteja limpa
                await page.goto(URL_FERRAMENTA_AFILIADO, { waitUntil: 'domcontentloaded' });

                // --- CONFIGURAÇÃO DOS SELETORES ---
                // IMPORTANTE: Inspecione a página (F12) para confirmar esses IDs/Classes se o script falhar.
                // ATUALIZADO: Corrigi os seletores com base nos arquivos de debug.
                const SELETOR_INPUT = 'textarea#url-0'; // O campo para colar o link é um <textarea> com id="url-0"
                const SELETOR_BOTAO_GERAR = '.button_generate-links'; // O botão de gerar tem a classe .button_generate-links
                const SELETOR_RESULTADO = '.showLink-component textarea'; // Pega a TEXTAREA que aparecer na área de resultados
                // ----------------------------------

                console.log(`🔹 Processando: ${linkOriginal}`);

                // Limpa o input e digita o link
                await page.waitForSelector(SELETOR_INPUT, { timeout: 10000 });

                await page.type(SELETOR_INPUT, linkOriginal, { delay: 20 });

                // Espera o botão "Gerar" ficar habilitado antes de clicar
                await page.waitForSelector(`${SELETOR_BOTAO_GERAR}:not([disabled])`, { timeout: 5000 });
                await page.click(SELETOR_BOTAO_GERAR);

                console.log('   ⏳ Aguardando o Mercado Livre gerar o link...');

                // Espera diretamente pelo seletor do resultado aparecer.
                // Aumentamos o timeout para dar tempo para a API do ML responder.
                await page.waitForSelector(SELETOR_RESULTADO, { timeout: 20000 });
                
                // Pega o valor do link gerado
                const linkAfiliado = await page.$eval(SELETOR_RESULTADO, el => el.value);

                console.log(`✅ Link Gerado: ${linkAfiliado}`);
                console.log('---');

            } catch (err) {
                console.error(`❌ Falha ao gerar link.`);
                console.error(`   Erro: ${err.message}`);
                console.error(`   Dica: Verifique se os seletores CSS (SELETOR_INPUT, etc) correspondem à página atual.`);

                // Salva o estado da página em caso de erro
                const arquivoErro = `debug_erro_${Date.now()}.html`;
                fs.writeFileSync(arquivoErro, await page.content());
                console.log(`   📸 Snapshot salvo em: ${arquivoErro}`);
            }
        }

    } catch (error) {
        console.error('Erro geral:', error);
    } finally {
        console.log('\n🏁 Finalizado.');
        await browser.close(); // Fecha o navegador ao terminar
    }
})();