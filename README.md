# Desafio QA Automation — Accenture

![CI](https://github.com/jefftheofilio/accenture-qa-challenge/actions/workflows/ci.yml/badge.svg)
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

## Autor

Jeff Theofilio