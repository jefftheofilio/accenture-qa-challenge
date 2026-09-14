import { ENV } from '../config/environment';

/**
 * Page Object da home do DemoQA.
 * Responsável apenas pela navegação até os formulários.
 */
class HomePage {
  selectors = {
    cardGroup: '.card-body h5',
    menuItem: '.element-list .menu-list li span',
  };

  visitar() {
    cy.visit(ENV.webUrl);
    return this;
  }

  escolherCard(nomeDoCard) {
    cy.contains(this.selectors.cardGroup, nomeDoCard).click();
    return this;
  }

  escolherSubmenu(nomeDoSubmenu) {
    cy.contains(this.selectors.menuItem, nomeDoSubmenu).click();
    return this;
  }
}

export default new HomePage();