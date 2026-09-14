/**
 * Page Object da página Web Tables.
 *
 * A aplicação usa uma tabela HTML nativa (`tbody > tr > td`) com os botões
 * de ação renderizados como `<span>` dentro de `div.action-buttons`, cujos
 * ids seguem o padrão `edit-record-N` / `delete-record-N`.
 *
 * O campo de busca é um input controlado que re-renderiza a listagem a cada
 * tecla e não sincroniza de forma confiável com a automação, por isso a
 * suíte não depende dele: amplia a paginação para 50 linhas e verifica
 * diretamente o corpo da tabela, sem filtro intermediário.
 */
class WebTablesPage {
  selectors = {
    addButton: '#addNewRecordButton',
    pageSizeSelect: 'select',
    firstName: '#firstName',
    lastName: '#lastName',
    email: '#userEmail',
    age: '#age',
    salary: '#salary',
    department: '#department',
    submitButton: '#submit',
    modal: '.modal-content',
    tabela: 'tbody',
    linhas: 'tbody tr',
    editButton: 'span[id^="edit-record"]',
    deleteButton: 'span[id^="delete-record"]',
  };

  confirmarPagina() {
    cy.url().should('include', '/webtables');
    this.removerAnuncios();
    cy.get(this.selectors.addButton).should('be.visible');
    this.exibirTodosOsRegistros();
    return this;
  }

  /**
   * O DemoQA insere blocos de anúncio que se sobrepõem aos botões de ação
   * da tabela, interceptando o clique. Remover os elementos do DOM mantém
   * o clique como um clique real de usuário, em vez de recorrer a
   * { force: true }, que ignoraria qualquer sobreposição — inclusive uma
   * regressão legítima da própria aplicação.
   */
  removerAnuncios() {
    cy.get('body').then(($body) => {
      ['#fixedban', 'footer', '#adplus-anchor', '.col-md-3.col-xl-3'].forEach((seletor) => {
        if ($body.find(seletor).length) cy.get(seletor).invoke('remove');
      });
    });
    return this;
  }

  /**
   * Amplia a paginação para 50 linhas — o maior valor oferecido pela
   * aplicação — garantindo que todos os registros criados fiquem visíveis
   * em uma única página.
   */
  exibirTodosOsRegistros() {
    cy.get(this.selectors.pageSizeSelect).should('exist').select('50');
    cy.get(this.selectors.pageSizeSelect).should('have.value', '50');
    return this;
  }

  abrirFormulario() {
    this.removerAnuncios();
    cy.get(this.selectors.addButton).scrollIntoView().click();
    cy.get(this.selectors.modal).should('be.visible');
    return this;
  }

  preencherFormulario(dados) {
    cy.get(this.selectors.firstName).clear().type(dados.firstName);
    cy.get(this.selectors.lastName).clear().type(dados.lastName);
    cy.get(this.selectors.email).clear().type(dados.email);
    cy.get(this.selectors.age).clear().type(dados.age);
    cy.get(this.selectors.salary).clear().type(dados.salary);
    cy.get(this.selectors.department).clear().type(dados.department);
    return this;
  }

  salvarFormulario() {
    cy.get(this.selectors.submitButton).click();
    cy.get(this.selectors.modal).should('not.exist');
    return this;
  }

  criarRegistro(dados) {
    this.abrirFormulario().preencherFormulario(dados).salvarFormulario();
    return this;
  }

  /**
   * Localiza a linha pelo e-mail, que é único por construção, e valida os
   * demais campos dentro dela.
   */
  validarRegistroPresente(dados) {
    cy.get(this.selectors.tabela).should('contain.text', dados.email);

    cy.contains(this.selectors.linhas, dados.email).within(() => {
      cy.contains('td', dados.firstName).should('exist');
      cy.contains('td', dados.lastName).should('exist');
      cy.contains('td', dados.age).should('exist');
      cy.contains('td', dados.salary).should('exist');
      cy.contains('td', dados.department).should('exist');
    });

    return this;
  }

  validarRegistroAusente(email) {
    cy.get(this.selectors.tabela).should('not.contain.text', email);
    return this;
  }

  editarRegistro(emailAtual, novosDados) {
    this.removerAnuncios();

    cy.contains(this.selectors.linhas, emailAtual)
      .find(this.selectors.editButton)
      .scrollIntoView()
      .click();

    cy.get(this.selectors.modal).should('be.visible');
    this.preencherFormulario(novosDados).salvarFormulario();
    return this;
  }

  /**
   * A exclusao e idempotente: se o registro ja nao esta na tabela, o metodo
   * encerra sem erro. Isso evita falha quando a re-renderizacao da tabela
   * antecipa a remocao durante uma exclusao em lote.
   */
  deletarRegistro(email) {
    this.removerAnuncios();

    cy.get(this.selectors.tabela).then(($tbody) => {
      if (!$tbody.text().includes(email)) {
        cy.log(`Registro ${email} ja removido da tabela`);
        return;
      }

      cy.contains(this.selectors.linhas, email)
        .find(this.selectors.deleteButton)
        .scrollIntoView()
        .click();
    });

    cy.get(this.selectors.tabela).should('not.contain.text', email);
    return this;
  }
}

export default new WebTablesPage();
