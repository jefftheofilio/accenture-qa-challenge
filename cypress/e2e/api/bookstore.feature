# language: pt

Funcionalidade: Gestão de usuário e aluguel de livros na BookStore API

  Como consumidor da API do DemoQA
  Quero criar um usuário, autenticá-lo e alugar livros
  Para validar o fluxo completo de ponta a ponta em uma única execução

  @api @regressao
  Cenário: Criar usuário, autorizar e alugar dois livros com sucesso
    Dado que eu crie um novo usuário na BookStore
    Quando eu gerar um token de acesso para esse usuário
    Então o usuário deve estar autorizado na API
    Quando eu listar os livros disponíveis no sistema
    E eu alugar os dois primeiros livros disponíveis
    Então os detalhes do usuário devem conter os 2 livros alugados
