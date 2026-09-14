# language: pt

# LIMITACAO DE FRAMEWORK — cenarios desabilitados.
#
# O componente Sortable usa react-dnd com backend HTML5, que depende do motor
# de drag nativo do navegador. Esse motor so e acionado por gesto real de
# ponteiro: eventos sinteticos disparados por JavaScript nao carregam a flag
# isTrusted e sao ignorados.
#
# Foram testadas quatro abordagens (dragover multiplo, dragenter previo,
# eventos de mouse e dragover com coordenadas), no Electron e no Chrome.
# Nenhuma alterou a ordem dos elementos.
#
# A implementacao permanece no repositorio como registro da analise. Os
# cenarios estao marcados com @skip para nao produzir falso negativo na
# suite. Ferramentas que operam via CDP ou WebDriver — Playwright e
# Selenium — nao tem essa restricao.

Funcionalidade: Ordenação de elementos por drag and drop

  Como usuário do DemoQA
  Quero reordenar os elementos da página Sortable arrastando-os
  Para que a coleção termine em ordem crescente

  @web @skip
  Cenário: Embaralhar e reordenar a aba List em ordem crescente
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Interactions" no menu principal
    E eu clicar no submenu "Sortable"
    E eu confirmar que estou na página Sortable
    E eu abrir a aba "List"
    E eu embaralhar os elementos da lista
    Então os elementos da lista não devem estar em ordem crescente
    Quando eu ordenar os elementos da lista em ordem crescente
    Então os elementos da lista devem estar em ordem crescente

  @web @skip
  Cenário: Embaralhar e reordenar a aba Grid em ordem crescente
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Interactions" no menu principal
    E eu clicar no submenu "Sortable"
    E eu confirmar que estou na página Sortable
    E eu abrir a aba "Grid"
    E eu embaralhar os elementos da grade
    Então os elementos da grade não devem estar em ordem crescente
    Quando eu ordenar os elementos da grade em ordem crescente
    Então os elementos da grade devem estar em ordem crescente
