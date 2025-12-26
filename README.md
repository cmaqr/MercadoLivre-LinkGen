# Mercado Livre LinkGen

Este projeto é uma ferramenta de automação desenvolvida em Node.js para gerar links de afiliados do Mercado Livre em massa. Ele utiliza o [Puppeteer](https://pptr.dev/) para simular um navegador, acessar a ferramenta de construção de links do Mercado Livre e gerar as URLs de afiliado automaticamente.

## 🚀 Funcionalidades

-   **Geração em Massa**: Aceita múltiplos links de produtos como argumento na linha de comando.
-   **Login Automático**: Suporte para login automático configurando credenciais em variáveis de ambiente.
-   **Persistência de Sessão**: Salva os dados da sessão (cookies/localStorage) localmente para evitar a necessidade de login a cada execução.
-   **Intervenção Manual**: Caso haja CAPTCHA ou autenticação de dois fatores (2FA), o navegador permanece visível para que você possa resolver manualmente.

## 📋 Pré-requisitos

-   [Node.js](https://nodejs.org/) instalado.
-   Conta ativa no programa de Afiliados do Mercado Livre.

##  Instalação

1.  Abra o terminal na pasta do projeto.
2.  Instale as dependências necessárias:

```bash
npm install
```

## ⚙️ Configuração (Opcional)

Para habilitar o login automático, crie um arquivo chamado `.env` na raiz do projeto e adicione suas credenciais:

```env
ML_EMAIL=seu_email@exemplo.com
ML_SENHA=sua_senha_secreta
```

> **Nota:** Se você optar por não criar este arquivo, o script abrirá o navegador e aguardará que você faça o login manualmente na primeira execução.

## ▶️ Como Usar

Execute o comando `node` apontando para o script principal e passando as URLs dos produtos que deseja converter:

```bash
node geradorDeLinks.js "LINK_PRODUTO_1" "LINK_PRODUTO_2" ...
```

**Exemplo:**

```bash
node geradorDeLinks.js https://produto.mercadolivre.com.br/MLB-123456-exemplo https://produto.mercadolivre.com.br/MLB-789012-outro
```

### Fluxo de Execução
1.  O navegador será aberto (modo não-headless).
2.  O script verifica se você já está logado. Se não, tenta o login automático (se configurado) ou aguarda seu login manual.
3.  Após o login, ele acessa a ferramenta de Link Builder.
4.  Para cada link fornecido, ele gera a URL de afiliado e exibe no terminal.

## 🛠️ Solução de Problemas

-   **Erro de Seletor**: O Mercado Livre pode alterar o layout da página, fazendo com que o robô não encontre os botões. Se isso ocorrer, o script salvará um arquivo HTML de debug (`debug_erro_....html`) para análise.
-   **Login Travado**: Se o login automático falhar (por exemplo, devido a um CAPTCHA), interaja com a janela do navegador aberta para completar o acesso. O script detectará automaticamente quando o login for concluído.

## 📄 Licença
ISC