import { When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import webTablesPage from '../../support/pages/web-tables.page';
import { buildRecordData } from '../../support/factories/record.factory';

/**
 * Os steps de navegação ficam em common/navigation.steps.js.
 *
 * Os registros criados são rastreados em memória para que a exclusão em
 * lote remova exatamente o que o teste inseriu, preservando os registros
 * pré-existentes da aplicação.
 */

let registrosCriados = [];

Before(() => {
  registrosCriados = [];
});

When('eu confirmar que estou na página Web Tables', () => {
  webTablesPage.confirmarPagina();
});

When('eu criar um novo registro com dados aleatórios', () => {
  const registro = buildRecordData();
  registrosCriados.push(registro);

  cy.log(`Registro criado: ${registro.firstName} ${registro.lastName} — ${registro.email}`);
  webTablesPage.criarRegistro(registro);
});

Then('o novo registro deve aparecer na tabela', () => {
  webTablesPage.validarRegistroPresente(registrosCriados[0]);
});

When('eu editar o registro criado com novos dados aleatórios', () => {
  const emailAtual = registrosCriados[0].email;
  const novosDados = buildRecordData();

  cy.log(`Editando ${emailAtual} para ${novosDados.email}`);
  webTablesPage.editarRegistro(emailAtual, novosDados);

  registrosCriados[0] = novosDados;
});

Then('os dados atualizados devem aparecer na tabela', () => {
  webTablesPage.validarRegistroPresente(registrosCriados[0]);
});

When('eu excluir o registro criado', () => {
  webTablesPage.deletarRegistro(registrosCriados[0].email);
});

Then('o registro não deve mais aparecer na tabela', () => {
  webTablesPage.validarRegistroAusente(registrosCriados[0].email);
});

/**
 * O parâmetro {int} vem do Gherkin: a quantidade é definida no cenário,
 * não no código. Alterar o número na feature muda o volume de massa sem
 * tocar nos step definitions.
 */
When('eu criar {int} novos registros com dados aleatórios', (quantidade) => {
  for (let i = 0; i < quantidade; i += 1) {
    const registro = buildRecordData();
    registrosCriados.push(registro);
    webTablesPage.criarRegistro(registro);
  }

  cy.log(`${quantidade} registros criados`);
});

Then('todos os {int} registros devem aparecer na tabela', (quantidade) => {
  expect(registrosCriados, 'registros rastreados').to.have.length(quantidade);

  registrosCriados.forEach((registro) => {
    webTablesPage.validarRegistroPresente(registro);
  });
});

When('eu excluir todos os registros criados', () => {
  registrosCriados.forEach((registro) => {
    webTablesPage.deletarRegistro(registro.email);
  });
});

Then('nenhum dos registros criados deve permanecer na tabela', () => {
  registrosCriados.forEach((registro) => {
    webTablesPage.validarRegistroAusente(registro.email);
  });
});
