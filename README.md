# 🤖 Mercado Livre Affiliate Link Generator

![License](https://img.shields.io/badge/license-ISC-blue.svg)

Uma ferramenta de automação desenvolvida em Node.js para gerar links de afiliados do Mercado Livre em massa. A ferramenta utiliza o [Puppeteer](https://pptr.dev/) para navegar, realizar login e extrair os links de forma automatizada.

## 🚀 Funcionalidades

-   **Geração em Massa**: Processe múltiplos links de produtos de uma só vez.
-   **Login Automático**: Configure suas credenciais uma vez e deixe o script fazer o login por você.
-   **Persistência de Sessão**: Mantém o login ativo entre execuções para agilizar o processo.
-   **Suporte a Proxy**: Configure um servidor de proxy para as requisições.
-   **Modo Interativo**: Se o login automático falhar (devido a CAPTCHA ou 2FA), o navegador permanece aberto para que a autenticação seja concluída manualmente.

## 📋 Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 16 ou superior)
-   Conta ativa no programa de Afiliados do Mercado Livre.

## ⚙️ Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/MercadoLivre-LinkGen.git
    cd MercadoLivre-LinkGen
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o arquivo de configuração:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```bash
    # No Windows (cmd)
    copy .env.example .env

    # No Linux/macOS
    cp .env.example .env
    ```

4.  **Edite o arquivo `.env`:**
    Abra o arquivo `.env` e preencha as variáveis de ambiente necessárias.

    | Variável        | Descrição                                                                               | Obrigatório |
    | --------------- | --------------------------------------------------------------------------------------- | ----------- |
    | `ML_EMAIL`      | Seu e-mail de login no Mercado Livre.                                                   | **Não**     |
    | `ML_SENHA`      | Sua senha do Mercado Livre.                                                             | **Não**     |
    | `PROXY_SERVER`  | Endereço do servidor de proxy. Ex: `http://123.123.123.123:8080`                         | Não         |
    | `PROXY_USERNAME`| Nome de usuário para autenticação no proxy (se necessário).                             | Não         |
    | `PROXY_PASSWORD`| Senha para autenticação no proxy (se necessário).                                       | Não         |

    > **Nota:** Se as credenciais `ML_EMAIL` e `ML_SENHA` não forem fornecidas, o script abrirá o navegador e aguardará que você faça o login manualmente na primeira execução.

## ▶️ Como Usar

Execute o script via linha de comando, passando as URLs dos produtos que deseja converter como argumentos.

```bash
node geradorDeLinks.js "URL_PRODUTO_1" "URL_PRODUTO_2" "URL_PRODUTO_3"
```

### Exemplo de Uso
```bash
node geradorDeLinks.js https://produto.mercadolivre.com.br/MLB-123-exemplo https://www.mercadolivre.com.br/p/MLB456-outro
```

O script irá processar cada link e exibir a URL de afiliado gerada diretamente no terminal.

## 🛠️ Solução de Problemas

-   **O script falha ao encontrar os campos (erro de seletor):** O Mercado Livre pode atualizar o layout de seu site. Se isso acontecer, o script salvará um arquivo de depuração (`debug_erro_TIMESTAMP.html`) com o estado da página no momento do erro. Utilize este arquivo para inspecionar os elementos (F12 no navegador) e atualizar os seletores (`SELETOR_INPUT`, `SELETOR_BOTAO_GERAR`, etc.) no topo do arquivo `geradorDeLinks.js`.
-   **Login automático travado:** Se a automação do login falhar por motivos como CAPTCHA ou verificação em duas etapas (2FA), simplesmente interaja com a janela do navegador que foi aberta para completar o processo. O script foi programado para detectar a conclusão do login e continuar a execução automaticamente.

## 📄 Licença

Este projeto é distribuído sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.
