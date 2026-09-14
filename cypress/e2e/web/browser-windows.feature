# language: pt

Funcionalidade: Abertura de nova janela pelo navegador

  Como usuário do DemoQA
  Quero abrir uma nova janela a partir da página Browser Windows
  Para que o conteúdo da página de amostra seja exibido corretamente

  @web @regressao
  Cenário: Abrir nova janela, validar a mensagem exibida e fechá-la
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Alerts, Frame & Windows" no menu principal
    E eu clicar no submenu "Browser Windows"
    E eu confirmar que estou na página Browser Windows
    E eu clicar no botão "New Window"
    Então uma nova janela deve ser aberta
    E a nova janela deve exibir a mensagem "This is a sample page"
    Quando eu fechar a nova janela
    Então eu devo retornar à página Browser Windows
