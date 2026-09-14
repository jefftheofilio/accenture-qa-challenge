import { When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import practiceFormPage from '../../support/pages/practice-form.page';
import { buildFormData } from '../../support/factories/form.factory';

/**
 * Os steps de navegacao ficam em common/navigation.steps.js.
 */

let dados = {};

Before(() => {
  dados = {};
});

When('eu confirmar que estou na página do Practice Form', () => {
  cy.url().should('include', '/automation-practice-form');
  practiceFormPage.removerAnuncios();
});

When('eu preencher todos os campos do formulário com dados aleatórios', () => {
  dados = buildFormData();

  cy.log(`Dados gerados: ${dados.firstName} ${dados.lastName} | ${dados.state}/${dados.city}`);

  practiceFormPage
    .preencherDadosPessoais(dados)
    .selecionarGenero(dados.gender)
    .preencherDataNascimento(dados.dateOfBirth)
    .informarMateria(dados.subject)
    .selecionarHobby(dados.hobby)
    .preencherEndereco(dados.address)
    .selecionarEstadoECidade(dados.state, dados.city);
});

When('eu anexar um arquivo de texto no campo de upload', () => {
  practiceFormPage.anexarArquivo(dados.arquivo);
  cy.get('#uploadPicture').should(($input) => {
    expect($input[0].files[0].name, 'arquivo anexado').to.eq('upload-teste.txt');
  });
});

When('eu submeter o formulário', () => {
  practiceFormPage.submeter();
});

Then('um popup de confirmação deve ser exibido com os dados enviados', () => {
  practiceFormPage.validarPopupAberto().validarDadosNoPopup(dados);
});

Then('eu devo conseguir fechar o popup', () => {
  practiceFormPage.fecharPopup();
});
