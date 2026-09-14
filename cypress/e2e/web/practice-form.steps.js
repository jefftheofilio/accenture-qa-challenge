import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import homePage from '../../support/pages/home.page';
import practiceFormPage from '../../support/pages/practice-form.page';
import { buildFormData } from '../../support/factories/form.factory';

let dados = {};

Before(() => {
  dados = {};
});

Given('que eu acesse a página inicial do DemoQA', () => {
  homePage.visitar();
  cy.url().should('include', 'demoqa.com');
});

When('eu escolher a opção {string} no menu principal', (card) => {
  homePage.escolherCard(card);
  cy.url().should('include', '/forms');
});

When('eu clicar no submenu {string}', (submenu) => {
  homePage.escolherSubmenu(submenu);
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