# Desafio QA Automation — Accenture

![CI](https://github.com/jefftheofilio/accenture-qa-challenge/actions/workflows/ci.yml/badge.svg)

Automação de testes das duas partes do desafio, implementada em Cypress com Cucumber (BDD):

- **Parte 1 — API:** fluxo completo da [BookStore API](https://demoqa.com/swagger/) do DemoQA, com os seis passos do enunciado executados de forma **contínua em uma única execução**.
- **Parte 2 — Front-end:** preenchimento e submissão do Practice Form, e abertura de nova janela pela página Browser Windows.

## Stack

| Ferramenta | Papel |
|---|---|
| Cypress | Execução dos testes e cliente HTTP (`cy.request`) |
| Cucumber (`@badeball/cypress-cucumber-preprocessor`) | BDD em Gherkin pt-BR |
| esbuild | Bundler dos step definitions |
| Faker | Geração de massa de teste dinâmica |

A escolha do Cypress atende às duas partes do desafio com um único stack: a mesma instalação cobre a automação de API e a de interface, com um só `npm install` e um só comando de execução.

## Pré-requisitos

- Node.js 22.x
- npm 10.x

## Instalação

```bash
git clone git@github.com:jefftheofilio/accenture-qa-challenge.git
cd accenture-qa-challenge
npm install
```

## Execução

```bash
npm test               # suíte completa (API + Web)
npm run test:api       # apenas a suíte de API
npm run test:web       # apenas a suíte de front-end
npm run cy:open        # modo interativo
```

Relatório HTML gerado em `reports/cucumber-report.html`.

## Parte 1 — Fluxo de API

| # | Endpoint | Validação |
|---|---|---|
| 1 | `POST /Account/v1/User` | 201, `userID` presente, coleção de livros vazia |
| 2 | `POST /Account/v1/GenerateToken` | 200, `status: Success`, token não vazio |
| 3 | `POST /Account/v1/Authorized` | 200, resposta `true` |
| 4 | `GET /BookStore/v1/Books` | 200, contrato de cada livro (`isbn`, `title`, `author`, `publisher`) |
| 5 | `POST /BookStore/v1/Books` | 201, dois livros na resposta |
| 6 | `GET /Account/v1/User/{userID}` | 200, ISBNs retornados conferem com os alugados |

## Parte 2 — Practice Form

| # | Passo | Validação |
|---|---|---|
| 1 | Acessar a home do DemoQA | URL carregada |
| 2 | Escolher o card "Forms" | Redirecionamento |
| 3 | Clicar no submenu "Practice Form" | URL `/automation-practice-form` |
| 4 | Preencher todos os campos com dados aleatórios | Campos preenchidos, incluindo datepicker e react-selects encadeados |
| 5 | Anexar arquivo `.txt` versionado no repositório | Nome do arquivo presente no input |
| 6 | Submeter o formulário | — |
| 7 | Validar o popup de confirmação | Modal visível, título correto e todos os dados enviados conferem |
| 8 | Fechar o popup | Modal removido do DOM |

## Parte 2 — Abertura de nova janela

| # | Passo | Validação |
|---|---|---|
| 1 | Acessar a home do DemoQA | URL carregada |
| 2 | Escolher o card "Alerts, Frame & Windows" | Redirecionamento |
| 3 | Clicar no submenu "Browser Windows" | URL `/browser-windows` |
| 4 | Clicar no botão "New Window" | Chamada a `window.open` interceptada |
| 5 | Validar a abertura da nova janela | URL `/sample` e target `_blank` |
| 6 | Validar a mensagem exibida | Texto "This is a sample page" |
| 7 | Fechar a nova janela | Retorno à página Browser Windows |

## Estrutura

```
cypress/
├── e2e/
│   ├── api/
│   │   ├── bookstore.feature
│   │   └── bookstore.steps.js
│   └── web/
│       ├── common/
│       │   └── navigation.steps.js     # steps de navegação compartilhados
│       ├── practice-form.feature
│       ├── practice-form.steps.js
│       ├── browser-windows.feature
│       └── browser-windows.steps.js
├── fixtures/
│   └── upload-teste.txt                # arquivo usado no campo de upload
└── support/
    ├── api/                            # Service Objects
    │   ├── account.service.js
    │   └── bookstore.service.js
    ├── config/
    │   └── environment.js              # ponto único de configuração
    ├── factories/                      # geração de massa de teste
    │   ├── user.factory.js
    │   └── form.factory.js
    ├── pages/                          # Page Objects
    │   ├── home.page.js
    │   ├── practice-form.page.js
    │   └── browser-windows.page.js
    └── e2e.js
```

## Decisões de arquitetura

**Service Object na camada de API.** Cada endpoint é encapsulado em um método com nome de negócio (`createUser`, `rentBooks`). Nenhum step conhece URL, header ou formato de payload. É o equivalente do Page Object para testes de API: quando um contrato muda, a alteração fica restrita a um arquivo, e os cenários permanecem intactos.

**Page Object com interface fluente.** Os seletores ficam isolados em um único objeto por página, e os métodos retornam `this`, permitindo encadear as ações na ordem em que o usuário as executa. O step lê como a descrição do cenário, sem nenhum seletor CSS vazando para a camada de teste.

**Steps de navegação compartilhados.** O acesso à home, a escolha do card e a seleção do submenu são comuns a todas as features de front-end. Manter essas definições em `cypress/e2e/web/common/navigation.steps.js` evita a duplicidade que o Cucumber rejeita e centraliza a manutenção quando a navegação do site mudar.

**Massa de teste dinâmica.** A API retorna `406 — User exists!` para `userName` repetido. A factory gera um usuário novo a cada execução, tornando a suíte reexecutável sem limpeza manual e apta a rodar em paralelo no CI. O mesmo vale para os dados do formulário.

**Nenhum ISBN hardcoded.** Os livros alugados vêm da resposta do passo 4. Se o catálogo mudar, o teste continua válido — ele testa o comportamento, não os dados.

**`failOnStatusCode: false` nos requests.** A decisão sobre o status esperado pertence ao teste, não ao framework. Sem isso, um 500 aborta a execução com stack trace em vez de produzir uma falha legível dizendo qual status veio e qual era esperado.

**Limpeza no hook `After`.** Os livros e o usuário criados são removidos ao final. O ambiente volta ao estado original, sem acúmulo de massa órfã entre execuções.

**Nova janela validada por interceptação de `window.open`.** O Cypress executa dentro de uma única aba e não controla janelas abertas pela aplicação — não existe equivalente ao `switchTo().window()` do Selenium. O cenário substitui `window.open` por um stub, valida que a aplicação solicitou a abertura com a URL e o target corretos, e então navega até esse endereço para verificar o conteúdo. O comportamento é testado integralmente, sem depender de um recurso que o framework não oferece.

**Remoção de banners em vez de `{ force: true }`.** O DemoQA exibe um banner fixo e um rodapé que interceptam o clique no botão de submit. Os elementos são removidos do DOM antes da interação, de modo que o clique continue sendo um clique real de usuário — uma eventual regressão de sobreposição na própria aplicação ainda seria detectada.

**Filtro restrito de exceções da aplicação.** O site carrega scripts de anúncio de terceiros e apresenta um erro conhecido de React 19 que derrubariam os testes por motivos alheios ao fluxo sob teste. O handler de `uncaught:exception` ignora apenas padrões nomeados; qualquer outro erro da aplicação continua falhando o teste, como deve.

**`retries: { runMode: 1 }`.** O DemoQA é um ambiente público e instável, com 502/503 intermitentes. Uma retentativa em modo headless separa falha real de indisponibilidade de ambiente. Em modo interativo os retries ficam desligados, para não mascarar erro durante o desenvolvimento.

**Asserts com mensagem descritiva.** Cada `expect` carrega um rótulo (`'status da criação do usuário'`). Na falha, a mensagem diz o que estava sendo verificado, sem exigir leitura do código.

## Defeitos identificados na aplicação

Durante a automação foi identificado um defeito na aplicação sob teste, reproduzido também em navegação manual.

**Botão "Close" do modal de confirmação não fecha o popup**

| | |
|---|---|
| **Onde** | `https://demoqa.com/automation-practice-form` — modal exibido após o submit |
| **Passos** | Preencher o formulário, submeter, clicar no botão "Close" |
| **Esperado** | O modal é fechado |
| **Obtido** | O modal permanece aberto |
| **Erro no console** | `TypeError: Lr.findDOMNode is not a function` |
| **Reprodução manual** | Sim — não é limitação da automação |
| **Contorno** | A tecla `Esc` fecha o modal normalmente |

**Causa provável.** O DemoQA foi migrado para React 19, que removeu a API `findDOMNode`. Componentes legados do site ainda a invocam durante o desmonte do modal, e a exceção interrompe o processo. A tecla `Esc` funciona porque o Bootstrap trata esse evento por um caminho que não passa pelo componente afetado.

**Decisão de automação.** O cenário mantém o clique no botão — é a ação esperada do usuário e o passo exigido pelo desafio — e usa `Esc` como fallback para concluir o fluxo, registrando o defeito no log da execução. Mascarar o assert para o teste passar esconderia um problema real da aplicação.

## Integração contínua

O pipeline em `.github/workflows/ci.yml` executa a suíte completa a cada push e pull request na branch `main`, publicando o relatório do Cucumber como artefato — inclusive quando a execução falha, que é justamente quando ele é mais necessário.

## Autor

Jeff Theofilio
