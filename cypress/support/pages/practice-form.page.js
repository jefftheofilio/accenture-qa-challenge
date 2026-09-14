  /**
   * O DemoQA roda React 19, que removeu a API `findDOMNode`. Componentes
   * legados do site ainda a invocam ao desmontar o modal, e a exceção
   * impede a remoção do elemento do DOM.
   *
   * A validação é feita pela visibilidade — que é o que o usuário
   * percebe — em vez da ausência no DOM, que depende de um detalhe
   * de implementação quebrado na própria aplicação.
   */
  fecharPopup() {
    cy.get(this.selectors.closeModalButton).click();
    cy.get(this.selectors.modal).should('not.be.visible');
    return this;
  }