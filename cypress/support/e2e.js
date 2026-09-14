// Ponto de entrada do suporte do Cypress.

/**
 * Filtro de exceções não tratadas originadas fora da aplicação sob teste.
 *
 * Dois grupos são ignorados:
 *
 * 1. Scripts de anúncio de terceiros carregados pelo DemoQA.
 *
 * 2. `findDOMNode is not a function` — bug conhecido da própria aplicação
 *    após a migração para React 19, que removeu essa API. A exceção é
 *    lançada por componentes legados do site e não impede a interação
 *    do usuário nem o fluxo sob teste.
 *
 * O filtro é deliberadamente restrito a padrões nomeados: qualquer outro
 * erro da aplicação continua falhando o teste, como deve.
 */
Cypress.on('uncaught:exception', (err) => {
  const errosIgnorados = [
    'Script error',
    'ResizeObserver loop',
    'adsbygoogle',
    'findDOMNode is not a function',
  ];

  const deveIgnorar = errosIgnorados.some((padrao) => err.message.includes(padrao));

  return !deveIgnorar;
});