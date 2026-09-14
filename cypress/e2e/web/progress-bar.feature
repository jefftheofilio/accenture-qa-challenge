# language: pt

Funcionalidade: Controle da Progress Bar

  Como usuário do DemoQA
  Quero iniciar, pausar e concluir a barra de progresso
  Para que o avanço seja refletido corretamente e possa ser reiniciado

  @web @regressao
  Cenário: Pausar a barra antes do limite, concluir e resetar
    Dado que eu acesse a página inicial do DemoQA
    Quando eu escolher a opção "Widgets" no menu principal
    E eu clicar no submenu "Progress Bar"
    E eu confirmar que estou na página Progress Bar
    E eu iniciar a barra de progresso
    E eu pausar a barra antes de atingir o limite
    Então o progresso exibido deve ser menor ou igual a 25 por cento
    Quando eu iniciar a barra de progresso novamente
    Então a barra deve atingir 100 por cento
    Quando eu resetar a barra de progresso
    Então a barra deve voltar para 0 por cento
