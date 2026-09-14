import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import homePage from '../../../support/pages/home.page';

/**
 * Steps de navegacao compartilhados entre as features de front-end.
 *
 * O acesso a home, a escolha do card e a selecao do submenu sao comuns a
 * todos os fluxos do DemoQA. Manter essas definicoes em um unico arquivo
 * evita duplicidade — que o Cucumber rejeita — e centraliza a manutencao
 * quando a navegacao do site mudar.
 */

Given('que eu acesse a página inicial do DemoQA', () => {
  homePage.visitar();
  cy.url().should('include', 'demoqa.com');
});

When('eu escolher a opção {string} no menu principal', (card) => {
  homePage.escolherCard(card);
});

When('eu clicar no submenu {string}', (submenu) => {
  homePage.escolherSubmenu(submenu);
});
