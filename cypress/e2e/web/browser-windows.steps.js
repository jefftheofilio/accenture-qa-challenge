import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import browserWindowsPage from '../../support/pages/browser-windows.page';

/**
 * Os steps de navegacao ficam em common/navigation.steps.js.
 */

When('eu confirmar que estou na página Browser Windows', () => {
  cy.url().should('include', '/browser-windows');
});

When('eu clicar no botão {string}', () => {
  browserWindowsPage.interceptarAberturaDeJanela().clicarEmNewWindow();
});

Then('uma nova janela deve ser aberta', () => {
  browserWindowsPage.validarAberturaDeNovaJanela();
});

Then('a nova janela deve exibir a mensagem {string}', (mensagem) => {
  browserWindowsPage.validarConteudoDaNovaJanela(mensagem);
});

When('eu fechar a nova janela', () => {
  browserWindowsPage.fecharNovaJanela();
});

Then('eu devo retornar à página Browser Windows', () => {
  cy.url().should('include', '/browser-windows');
});
