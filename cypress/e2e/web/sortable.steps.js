import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import sortablePage from '../../support/pages/sortable.page';

/**
 * Os steps de navegacao ficam em common/navigation.steps.js.
 */

const escopos = {
  lista: () => sortablePage.selectors.itensLista,
  grade: () => sortablePage.selectors.itensGrade,
};

const ordens = {
  lista: () => sortablePage.constructor.ORDEM_LISTA,
  grade: () => sortablePage.constructor.ORDEM_GRADE,
};

When('eu confirmar que estou na página Sortable', () => {
  sortablePage.confirmarPagina();
});

When('eu abrir a aba {string}', (aba) => {
  sortablePage.abrirAba(aba);
});

When('eu embaralhar os elementos da lista', () => {
  sortablePage.embaralhar(escopos.lista(), ordens.lista().length);
});

When('eu embaralhar os elementos da grade', () => {
  sortablePage.embaralhar(escopos.grade(), ordens.grade().length);
});

Then('os elementos da lista não devem estar em ordem crescente', () => {
  sortablePage.validarOrdemDiferenteDe(escopos.lista(), ordens.lista());
});

Then('os elementos da grade não devem estar em ordem crescente', () => {
  sortablePage.validarOrdemDiferenteDe(escopos.grade(), ordens.grade());
});

When('eu ordenar os elementos da lista em ordem crescente', () => {
  sortablePage.ordenarCrescente(escopos.lista(), ordens.lista());
});

When('eu ordenar os elementos da grade em ordem crescente', () => {
  sortablePage.ordenarCrescente(escopos.grade(), ordens.grade());
});

Then('os elementos da lista devem estar em ordem crescente', () => {
  sortablePage.validarOrdem(escopos.lista(), ordens.lista());
});

Then('os elementos da grade devem estar em ordem crescente', () => {
  sortablePage.validarOrdem(escopos.grade(), ordens.grade());
});
