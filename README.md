# Desafio QA Automation — Accenture

![CI](https://github.com/jefftheofilio/accenture-qa-challenge/actions/workflows/ci.yml/badge.svg)

Automação de testes das duas partes do desafio, implementada em Cypress com Cucumber (BDD):

- **Parte 1 — API:** fluxo completo da [BookStore API](https://demoqa.com/swagger/) do DemoQA, com os seis passos do enunciado executados de forma **contínua em uma única execução**.
- **Parte 2 — Front-end:** Practice Form, abertura de nova janela, CRUD na Web Tables (com o cenário bônus de criação e exclusão dinâmica em lote) e controle da Progress Bar.

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

## Parte 2 — Web Tables (CRUD)

| # | Passo | Validação |
|---|---|---|
| 1 | Acessar a home e navegar até Web Tables | URL `/webtables` |
| 2 | Criar um registro com dados aleatórios | Registro presente na tabela com todos os campos |
| 3 | Editar o registro criado | Dados atualizados refletidos na tabela |
| 4 | Excluir o registro | Registro ausente da tabela |
| 5 | **Bônus:** criar 12 registros dinamicamente | Quantidade parametrizada no Gherkin via `{int}` |
| 6 | **Bônus:** excluir todos os registros criados | Nenhum dos 12 permanece; registros originais preservados |

## Parte 2 — Progress Bar

| # | Passo | Validação |
|---|---|---|
| 1 | Acessar a home e navegar até Progress Bar | URL `/progress-bar` |
| 2 | Iniciar a barra | — |
| 3 | Pausar antes do limite | Espera pela condição no `aria-valuenow`, não por tempo fixo |
| 4 | Validar o progresso | Valor ≤ 25% e barra efetivamente parada (duas leituras iguais) |
| 5 | Retomar até 100% | `aria-valuenow` igual a 100 e classe `bg-success` |
| 6 | Resetar a barra | Botão volta a "Start", Reset some, preenchimento removido |

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
│       ├── browser-windows.steps.js
│       ├── web-tables.feature
│       ├── web-tables.steps.js
│       ├── progress-bar.feature
│       └── progress-bar.steps.js
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
    │   ├── form.factory.js
    │   └── record.factory.js
    ├── pages/                          # Page Objects
    │   ├── home.page.js
    │   ├── practice-form.page.js
    │   ├── browser-windows.page.js
    │   ├── web-tables.page.js
    │   └── progress-bar.page.js
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

**Espera por condição em vez de tempo fixo.** O requisito de pausar a barra antes dos 25% seria frágil com `cy.wait` de duração fixa: a velocidade da animação varia entre máquinas e no CI. A suíte aguarda o `aria-valuenow` cruzar um limiar de 15% e só então clica, com margem deliberada para absorver o intervalo entre a leitura e o efeito do clique. Em teste manual, o mesmo gesto parou em 28% — acima do limite —, o que ilustra por que a margem existe.

**Estado validado pelo atributo semântico.** O progresso é lido de `aria-valuenow`, não do texto exibido: o atributo é a fonte semântica do componente e independe de formatação. A parada é confirmada com duas leituras em instantes distintos, provando que a barra está de fato pausada e não apenas lenta.

**Volume parametrizado no Gherkin.** O cenário bônus usa `{int}` para a quantidade de registros: alterar `12` para outro valor na feature muda o volume de massa sem tocar em uma linha de step definition. A regra de negócio fica declarada no cenário, não escondida no código.

**Paginação ampliada em vez de filtro por busca.** O campo de busca da Web Tables é um input controlado que re-renderiza a listagem a cada tecla e não sincroniza de forma confiável com a automação — caracteres se perdem e o filtro fica truncado. A suíte amplia a paginação para 50 linhas e verifica diretamente o corpo da tabela. Além de estável, elimina 24 digitações longas por execução: o cenário bônus caiu de 3m41s para 18s.

**Exclusão idempotente.** O método de remoção verifica a presença do registro antes de clicar. Durante uma exclusão em lote, a re-renderização da tabela pode antecipar a remoção de uma linha, e a verificação prévia evita uma falha por condição de corrida sem mascarar o resultado final, que continua sendo assertado.

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
