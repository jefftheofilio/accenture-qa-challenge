import { ENV } from '../config/environment';

/**
 * Page Object da página Browser Windows.
 *
 * LIMITAÇÃO ARQUITETURAL DO CYPRESS:
 * O Cypress executa dentro de uma única aba do navegador e não controla
 * janelas ou abas abertas pela aplicação — não existe equivalente ao
 * `switchTo().window()` do Selenium.
 *
 * O botão "New Window" invoca `window.open('/sample', '_blank')`. A
 * estratégia adotada intercepta essa chamada, valida que a aplicação
 * pediu a abertura da janela com a URL correta, e então navega até essa
 * URL para validar o conteúdo exibido.
 *
 * O comportamento da aplicação é verificado integralmente: que a nova
 * janela foi solicitada, para qual endereço, e o que ela apresenta.
 */
class BrowserWindowsPage {
  selectors = {
    newWindowButton: '#windowButton',
    sampleHeading: '#sampleHeading',
  };

  /**
   * Substitui `window.open` por um stub antes do clique, capturando a
   * chamada sem abrir a janela fora do controle do runner.
   */
  interceptarAberturaDeJanela() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    return this;
  }

  clicarEmNewWindow() {
    cy.get(this.selectors.newWindowButton).should('be.visible').click();
    return this;
  }

  /**
   * Valida que a aplicação solicitou a abertura de uma nova janela e
   * registra a URL de destino para a navegação seguinte.
   */
  validarAberturaDeNovaJanela() {
    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .then((stub) => {
        const [url, target] = stub.getCall(0).args;

        expect(url, 'URL da nova janela').to.include('/sample');
        expect(target, 'target da nova janela').to.eq('_blank');

        cy.wrap(url).as('urlNovaJanela');
      });
    return this;
  }

  /**
   * Navega até a URL capturada e valida a mensagem exibida.
   */
  validarConteudoDaNovaJanela(mensagemEsperada) {
    cy.get('@urlNovaJanela').then((url) => {
      cy.visit(`${ENV.webUrl}${url}`);
      cy.get(this.selectors.sampleHeading)
        .should('be.visible')
        .and('have.text', mensagemEsperada);
    });
    return this;
  }

  /**
   * Encerra o contexto da janela auxiliar e retorna à página de origem.
   *
   * Como a abertura foi interceptada, não há uma janela do sistema
   * operacional a fechar: o equivalente funcional é abandonar o contexto
   * da página de amostra e confirmar que a aplicação original segue
   * operante — que é o estado que o usuário observa após fechar a janela.
   */
  fecharNovaJanela() {
    cy.go('back');
    cy.url().should('include', '/browser-windows');
    cy.get(this.selectors.newWindowButton).should('be.visible');
    return this;
  }
}

export default new BrowserWindowsPage();
