import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import progressBarPage from '../../support/pages/progress-bar.page';

/**
 * Os steps de navegacao ficam em common/navigation.steps.js.
 */

When('eu confirmar que estou na página Progress Bar', () => {
  progressBarPage.confirmarPagina();
});

When('eu iniciar a barra de progresso', () => {
  progressBarPage.iniciar();
});

When('eu pausar a barra antes de atingir o limite', () => {
  progressBarPage.pausarAoAtingirLimiar();
});

Then('o progresso exibido deve ser menor ou igual a {int} por cento', (teto) => {
  progressBarPage.validarProgressoPausado(teto);
});

When('eu iniciar a barra de progresso novamente', () => {
  progressBarPage.iniciar();
});

Then('a barra deve atingir {int} por cento', () => {
  progressBarPage.aguardarConclusao();
});

When('eu resetar a barra de progresso', () => {
  progressBarPage.resetar();
});

Then('a barra deve voltar para {int} por cento', () => {
  progressBarPage.validarBarraZerada();
});
