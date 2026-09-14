# Desafio QA Automation — Accenture

Automação de testes do fluxo de **BookStore API** do [DemoQA](https://demoqa.com/swagger/), implementada em Cypress com Cucumber (BDD).

O cenário executa os seis passos do desafio de forma **contínua, em uma única execução**, sem intervenção manual entre eles.

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
npm run test:api      # suíte de API (headless)
npm run cy:open       # modo interativo
npm test              # suíte completa
```

Relatório HTML gerado em `reports/cucumber-report.html`.

## Fluxo automatizado

| # | Endpoint | Validação |
|---|---|---|
| 1 | `POST /Account/v1/User` | 201, `userID` presente, coleção de livros vazia |
| 2 | `POST /Account/v1/GenerateToken` | 200, `status: Success`, token não vazio |
| 3 | `POST /Account/v1/Authorized` | 200, resposta `true` |
| 4 | `GET /BookStore/v1/Books` | 200, contrato de cada livro (`isbn`, `title`, `author`, `publisher`) |
| 5 | `POST /BookStore/v1/Books` | 201, dois livros na resposta |
| 6 | `GET /Account/v1/User/{userID}` | 200, ISBNs retornados conferem com os alugados |

## Estrutura


## Decisões de arquitetura

**Service Object na camada de API.** Cada endpoint é encapsulado em um método com nome de negócio (`createUser`, `rentBooks`). Nenhum step conhece URL, header ou formato de payload. É o equivalente do Page Object para testes de API: quando um contrato muda, a alteração fica restrita a um arquivo, e os cenários permanecem intactos.

**Massa de teste dinâmica.** A API retorna `406 — User exists!` para `userName` repetido. A factory gera um usuário novo a cada execução, tornando a suíte reexecutável sem limpeza manual e apta a rodar em paralelo no CI.

**Nenhum ISBN hardcoded.** Os livros alugados vêm da resposta do passo 4. Se o catálogo mudar, o teste continua válido — ele testa o comportamento, não os dados.

**`failOnStatusCode: false` nos requests.** A decisão sobre o status esperado pertence ao teste, não ao framework. Sem isso, um 500 aborta a execução com stack trace em vez de produzir uma falha legível dizendo qual status veio e qual era esperado.

**Limpeza no hook `After`.** Os livros e o usuário criados são removidos ao final. O ambiente volta ao estado original, sem acúmulo de massa órfã entre execuções.

**`retries: { runMode: 1 }`.** O DemoQA é um ambiente público e instável, com 502/503 intermitentes. Uma retentativa em modo headless separa falha real de indisponibilidade de ambiente. Em modo interativo os retries ficam desligados, para não mascarar erro durante o desenvolvimento.

**Asserts com mensagem descritiva.** Cada `expect` carrega um rótulo (`'status da criação do usuário'`). Na falha, a mensagem diz o que estava sendo verificado, sem exigir leitura do código.

## Autor

Jeff Theofilio