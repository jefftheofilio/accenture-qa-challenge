# language: pt

Funcionalidade: Preenchimento e submissão do Practice Form

  Como usuário do DemoQA
  Quero preencher o formulário de estudante com meus dados
  Para que o sistema confirme o envio exibindo os dados submetidos

  @web @regressao
  Cenário: Preencher todos os campos do formulário e submeter com sucesso
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Forms" no menu principal
    E eu clicar no submenu "Practice Form"
    E eu preencher todos os campos do formulário com dados aleatórios
    E eu anexar um arquivo de texto no campo de upload
    E eu submeter o formulário
    Então um popup de confirmação deve ser exibido com os dados enviados
    E eu devo conseguir fechar o popup