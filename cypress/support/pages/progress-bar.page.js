/**
 * Page Object da pagina Progress Bar.
 *
 * O mesmo botao (#startStopButton) inicia e pausa a barra, alternando o
 * rotulo entre "Start" e "Stop". Ao atingir 100% ele e substituido pelo
 * #resetButton.
 *
 * O valor corrente e lido do atributo aria-valuenow, e nao do texto
 * exibido: o atributo e a fonte semantica do componente e nao depende de
 * formatacao.
 */
class ProgressBarPage {
  selectors = {
    startStopButton: '#startStopButton',
    resetButton: '#resetButton',
    barra: '#progressBar div[role="progressbar"]',
  };

  /**
   * Limiar de parada. A barra continua avancando entre a leitura do valor
   * e o efeito do clique, entao parar em 15% garante folga suficiente para
   * o teto de 25% do requisito ser respeitado mesmo em maquina lenta ou no
   * CI. Um cy.wait de tempo fixo nao ofereceria essa garantia.
   */
  static LIMIAR_DE_PARADA = 15;

  confirmarPagina() {
    cy.url().should('include', '/progress-bar');
    this.removerAnuncios();
    cy.get(this.selectors.startStopButton).should('be.visible');
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

  iniciar() {
    cy.get(this.selectors.startStopButton).click();
    return this;
  }

  /**
   * A espera e pela condicao, nao por tempo: o Cypress reconsulta o
   * atributo ate que ele atinja o limiar, tornando o teste deterministico
   * independentemente da velocidade da animacao no ambiente.
   */
  pausarAoAtingirLimiar() {
    cy.get(this.selectors.barra, { timeout: 30000 }).should(($barra) => {
      const valor = Number($barra.attr('aria-valuenow'));
      expect(valor, 'progresso atingiu o limiar de parada').to.be.at.least(
        ProgressBarPage.LIMIAR_DE_PARADA
      );
    });

    cy.get(this.selectors.startStopButton).click();
    return this;
  }

  /**
   * Confirma que a barra realmente parou: o valor lido duas vezes em
   * instantes distintos precisa ser o mesmo.
   */
  validarProgressoPausado(tetoPercentual) {
    let valorInicial;

    cy.get(this.selectors.barra)
      .invoke('attr', 'aria-valuenow')
      .then((valor) => {
        valorInicial = Number(valor);
        expect(valorInicial, 'progresso dentro do teto exigido').to.be.at.most(tetoPercentual);
      });

    cy.wait(500);

    cy.get(this.selectors.barra)
      .invoke('attr', 'aria-valuenow')
      .then((valor) => {
        expect(Number(valor), 'barra permanece pausada').to.eq(valorInicial);
      });

    return this;
  }

  aguardarConclusao() {
    cy.get(this.selectors.barra, { timeout: 60000 }).should(
      'have.attr',
      'aria-valuenow',
      '100'
    );

    cy.get(this.selectors.barra).should('have.class', 'bg-success');
    return this;
  }

  /**
   * O clique no Reset pode nao surtir efeito se chegar enquanto o React
   * ainda processa a transicao para 100%. O metodo confirma o efeito e
   * repete a acao uma vez caso o botao permaneca em tela.
   */
  resetar() {
    this.removerAnuncios();
    cy.get(this.selectors.resetButton).should('be.visible').click();

    cy.get('body').then(($body) => {
      if ($body.find(this.selectors.resetButton).length) {
        cy.log('Reset nao surtiu efeito no primeiro clique — repetindo');
        cy.get(this.selectors.resetButton).click();
      }
    });

    return this;
  }

  /**
   * Valida o estado observavel pelo usuario apos o reset: a barra deixa de
   * estar preenchida, o botao volta a oferecer "Start" e o Reset some.
   */
  validarBarraZerada() {
    cy.get(this.selectors.startStopButton, { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Start');

    cy.get(this.selectors.resetButton).should('not.exist');
    cy.get('#progressBar').find('.bg-success').should('not.exist');
    return this;
  }
}

export default new ProgressBarPage();
