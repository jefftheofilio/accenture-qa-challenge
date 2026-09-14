/**
 * Page Object da pagina Sortable.
 *
 * A pagina oferece duas abas (List e Grid) com a mesma classe de item, por
 * isso todo seletor e escopado pelo painel correspondente.
 *
 * Os itens ja sao renderizados em ordem crescente. Para que o cenario tenha
 * valor, a suite embaralha a colecao antes de ordena-la: um teste que apenas
 * validasse a ordem inicial passaria sem executar um unico arraste.
 *
 * O componente usa react-dnd com backend HTML5 (atributos draggable e
 * data-handler-id). O Cypress nao possui comando nativo de drag and drop,
 * entao os eventos sao disparados manualmente com um objeto DataTransfer.
 */
class SortablePage {
  selectors = {
    abaLista: '#demo-tab-list',
    abaGrade: '#demo-tab-grid',
    itensLista: '#demo-tabpane-list .list-group-item',
    itensGrade: '#demo-tabpane-grid .list-group-item',
  };

  static ORDEM_LISTA = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
  static ORDEM_GRADE = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  confirmarPagina() {
    cy.url().should('include', '/sortable');
    this.removerAnuncios();
    cy.get(this.selectors.abaLista).should('be.visible');
    return this;
  }

  removerAnuncios() {
    cy.get('body').then(($body) => {
      ['#fixedban', 'footer', '#adplus-anchor', '.col-md-3.col-xl-3'].forEach((seletor) => {
        if ($body.find(seletor).length) cy.get(seletor).invoke('remove');
      });
    });
    return this;
  }

  abrirAba(nome) {
    const aba = nome === 'Grid' ? this.selectors.abaGrade : this.selectors.abaLista;
    cy.get(aba).click();
    return this;
  }

  /**
   * Dispara a sequencia de eventos HTML5 que o react-dnd consome.
   * O reordenamento ocorre no dragover: o item de origem assume a posicao
   * do item sob o cursor.
   */
  arrastar(escopo, indiceOrigem, indiceDestino) {
    const dataTransfer = new DataTransfer();

    cy.get(escopo).eq(indiceOrigem).trigger('dragstart', { dataTransfer, force: true });
    cy.get(escopo).eq(indiceDestino).trigger('dragover', { dataTransfer, force: true });
    cy.get(escopo).eq(indiceDestino).trigger('drop', { dataTransfer, force: true });
    cy.get('body').trigger('dragend', { dataTransfer, force: true });

    return this;
  }

  /**
   * Embaralha invertendo a colecao: cada item do fim e arrastado para o
   * inicio. O resultado e deterministico, ao contrario de uma ordem
   * aleatoria, o que mantem o teste reproduzivel.
   */
  embaralhar(escopo, quantidade) {
    const movimentos = [
      [0, quantidade - 1],
      [1, quantidade - 2],
      [0, Math.floor(quantidade / 2)],
    ];

    movimentos.forEach(([de, para]) => {
      if (de !== para) this.arrastar(escopo, de, para);
    });

    return this;
  }

  /**
   * Ordena por insercao: para cada posicao alvo, localiza o item esperado e
   * o arrasta ate la.
   *
   * A colecao e reconsultada dentro de cada iteracao porque o DOM e
   * reconstruido a cada movimento — reaproveitar uma referencia anterior
   * produziria erro de elemento destacado do DOM.
   */
  ordenarCrescente(escopo, ordemEsperada) {
    const passadas = ordemEsperada.length;

    for (let passada = 0; passada < passadas; passada += 1) {
      ordemEsperada.forEach((texto, indiceAlvo) => {
        cy.get(escopo).then(($itens) => {
          const atual = [...$itens].map((el) => el.textContent.trim());
          const indiceAtual = atual.indexOf(texto);

          if (indiceAtual !== indiceAlvo && indiceAtual !== -1) {
            this.arrastar(escopo, indiceAtual, indiceAlvo);
          }
        });
      });
    }

    return this;
  }

  validarOrdem(escopo, ordemEsperada) {
    cy.get(escopo).should(($itens) => {
      const atual = [...$itens].map((el) => el.textContent.trim());
      expect(atual, 'ordem dos itens').to.deep.eq(ordemEsperada);
    });
    return this;
  }

  validarOrdemDiferenteDe(escopo, ordemOriginal) {
    cy.get(escopo).should(($itens) => {
      const atual = [...$itens].map((el) => el.textContent.trim());
      expect(atual, 'colecao foi efetivamente embaralhada').to.not.deep.eq(ordemOriginal);
    });
    return this;
  }
}

export default new SortablePage();
