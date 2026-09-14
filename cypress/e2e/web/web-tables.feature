# language: pt

Funcionalidade: Gestão de registros na Web Tables

  Como usuário do DemoQA
  Quero criar, editar e excluir registros na tabela de funcionários
  Para que as alterações sejam refletidas corretamente na listagem

  Contexto:
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Elements" no menu principal
    E eu clicar no submenu "Web Tables"
    E eu confirmar que estou na página Web Tables

  @web @regressao
  Cenário: Criar, editar e excluir um registro
    Quando eu criar um novo registro com dados aleatórios
    Então o novo registro deve aparecer na tabela
    Quando eu editar o registro criado com novos dados aleatórios
    Então os dados atualizados devem aparecer na tabela
    Quando eu excluir o registro criado
    Então o registro não deve mais aparecer na tabela

  @web @bonus
  Cenário: Criar doze registros de forma dinâmica e excluí-los em lote
    Quando eu criar 12 novos registros com dados aleatórios
    Então todos os 12 registros devem aparecer na tabela
    Quando eu excluir todos os registros criados
    Então nenhum dos registros criados deve permanecer na tabela
