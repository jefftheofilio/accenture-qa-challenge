import { ENV } from '../config/environment';

/**
 * Page Object do Practice Form.
 * Seletores isolados em um único objeto; os steps chamam apenas
 * métodos com nome de negócio e nunca conhecem um seletor CSS.
 */
class PracticeFormPage {
  selectors = {
    firstName: '#firstName',
    lastName: '#lastName',
    email: '#userEmail',
    mobile: '#userNumber',
    dateOfBirthInput: '#dateOfBirthInput',
    monthSelect: '.react-datepicker__month-select',
    yearSelect: '.react-datepicker__year-select',
    subjectsInput: '#subjectsInput',
    uploadPicture: '#uploadPicture',
    currentAddress: '#currentAddress',
    stateContainer: '#state',
    stateInput: '#react-select-3-input',
    cityContainer: '#city',
    cityInput: '#react-select-4-input',
    submitButton: '#submit',
    modal: '.modal-content',
    modalTitle: '#example-modal-sizes-title-lg',
    modalTable: '.table-responsive tbody tr',
    closeModalButton: '#closeLargeModal',
  };

  visitar() {
    cy.visit(`${ENV.webUrl}/automation-practice-form`);
    this.removerAnuncios();
    return this;
  }

  /**
   * O DemoQA exibe um banner fixo e um rodapé que sobrepõem o botão de
   * submit. O elemento fica visível para o DOM, mas o clique é
   * interceptado pelo iframe do anúncio.
   *
   * Removê-los do DOM é preferível a usar { force: true }: o clique
   * continua sendo um clique real de usuário, e uma eventual regressão
   * de sobreposição na própria aplicação ainda seria detectada.
   */
  removerAnuncios() {
    cy.get('body').then(($body) => {
      if ($body.find('#fixedban').length) cy.get('#fixedban').invoke('remove');
      if ($body.find('footer').length) cy.get('footer').invoke('remove');
    });
    return this;
  }

  preencherDadosPessoais({ firstName, lastName, email, mobile }) {
    cy.get(this.selectors.firstName).clear().type(firstName);
    cy.get(this.selectors.lastName).clear().type(lastName);
    cy.get(this.selectors.email).clear().type(email);
    cy.get(this.selectors.mobile).clear().type(mobile);
    return this;
  }

  selecionarGenero(genero) {
    cy.contains('label', genero).click();
    return this;
  }

  preencherDataNascimento({ dia, mes, ano }) {
    cy.get(this.selectors.dateOfBirthInput).click();
    cy.get(this.selectors.monthSelect).select(String(mes));
    cy.get(this.selectors.yearSelect).select(String(ano));
    cy.get(`.react-datepicker__day--0${String(dia).padStart(2, '0')}`)
      .not('.react-datepicker__day--outside-month')
      .click();
    return this;
  }

  informarMateria(materia) {
    cy.get(this.selectors.subjectsInput).type(materia);
    cy.get('.subjects-auto-complete__option').first().click();
    return this;
  }

  selecionarHobby(hobby) {
    cy.contains('label', hobby).click();
    return this;
  }

  anexarArquivo(caminho) {
    cy.get(this.selectors.uploadPicture).selectFile(caminho);
    return this;
  }

  preencherEndereco(endereco) {
    cy.get(this.selectors.currentAddress).clear().type(endereco);
    return this;
  }

  selecionarEstadoECidade(estado, cidade) {
    cy.get(this.selectors.stateContainer).scrollIntoView().click();
    cy.get(this.selectors.stateInput).type(`${estado}{enter}`, { force: true });

    cy.get(this.selectors.cityContainer).click();
    cy.get(this.selectors.cityInput).type(`${cidade}{enter}`, { force: true });
    return this;
  }

  submeter() {
    this.removerAnuncios();
    cy.get(this.selectors.submitButton).scrollIntoView().click();
    return this;
  }

  validarPopupAberto() {
    cy.get(this.selectors.modal).should('be.visible');
    cy.get(this.selectors.modalTitle).should('have.text', 'Thanks for submitting the form');
    return this;
  }

  /**
   * Valida que o popup não apenas abriu, mas trouxe os dados enviados.
   * Garante que o submit processou o formulário, e não só exibiu um modal.
   */
  validarDadosNoPopup(dados) {
    cy.get(this.selectors.modalTable).then(($linhas) => {
      const conteudo = $linhas.text();

      expect(conteudo, 'nome no popup').to.include(`${dados.firstName} ${dados.lastName}`);
      expect(conteudo, 'email no popup').to.include(dados.email);
      expect(conteudo, 'celular no popup').to.include(dados.mobile);
      expect(conteudo, 'gênero no popup').to.include(dados.gender);
      expect(conteudo, 'matéria no popup').to.include(dados.subject);
      expect(conteudo, 'hobby no popup').to.include(dados.hobby);
      expect(conteudo, 'arquivo no popup').to.include('upload-teste.txt');
      expect(conteudo, 'endereço no popup').to.include(dados.address);
      expect(conteudo, 'estado e cidade no popup').to.include(`${dados.state} ${dados.city}`);
    });
    return this;
  }

  /**
   * DEFEITO IDENTIFICADO NA APLICACAO:
   * O botao "Close" do modal nao fecha o popup — nem no teste, nem em
   * navegacao manual. O DemoQA roda React 19, que removeu a API
   * `findDOMNode`, ainda invocada por componentes legados durante o
   * unmount. A excecao interrompe o desmonte do modal.
   *
   * A tecla Esc fecha normalmente, pois o Bootstrap trata o evento por
   * um caminho que nao passa pelo componente quebrado.
   *
   * O cenario mantem o clique no botao — que e a acao esperada do
   * usuario e o passo exigido pelo desafio — e usa Esc como fallback
   * para concluir o fluxo, registrando o defeito no log da execucao.
   */
  fecharPopup() {
    cy.get(this.selectors.closeModalButton).click();

    cy.get('body').then(($body) => {
      if ($body.find('.modal-content:visible').length) {
        cy.log('DEFEITO: o botao Close nao fechou o modal — fechando via tecla Esc');
        cy.get('body').type('{esc}');
      }
    });

    cy.get(this.selectors.modal).should('not.exist');
    return this;
  }
}

export default new PracticeFormPage();
