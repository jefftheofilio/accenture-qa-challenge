import { Given, When, Then, Before, After } from '@badeball/cypress-cucumber-preprocessor';
import accountService from '../../support/api/account.service';
import bookStoreService from '../../support/api/bookstore.service';
import { buildUser } from '../../support/factories/user.factory';

let ctx = {};

Before(() => {
  ctx = {};
});

Given('que eu crie um novo usuário na BookStore', () => {
  ctx.user = buildUser();

  accountService.createUser(ctx.user.userName, ctx.user.password).then((res) => {
    expect(res.status, 'status da criação do usuário').to.eq(201);
    expect(res.body, 'payload de criação').to.have.property('userID');
    expect(res.body.username, 'username retornado').to.eq(ctx.user.userName);
    expect(res.body.books, 'usuário novo sem livros').to.be.an('array').that.is.empty;

    ctx.userId = res.body.userID;
    cy.log(`Usuário criado: ${ctx.user.userName} (${ctx.userId})`);
  });
});

When('eu gerar um token de acesso para esse usuário', () => {
  accountService.generateToken(ctx.user.userName, ctx.user.password).then((res) => {
    expect(res.status, 'status da geração de token').to.eq(200);
    expect(res.body.status, 'status textual do token').to.eq('Success');
    expect(res.body.result, 'mensagem do token').to.eq('User authorized successfully.');
    expect(res.body.token, 'token JWT').to.be.a('string').and.not.be.empty;

    ctx.token = res.body.token;
  });
});

Then('o usuário deve estar autorizado na API', () => {
  accountService.isAuthorized(ctx.user.userName, ctx.user.password).then((res) => {
    expect(res.status, 'status da autorização').to.eq(200);
    expect(res.body, 'usuário autorizado').to.eq(true);
  });
});

When('eu listar os livros disponíveis no sistema', () => {
  bookStoreService.listBooks().then((res) => {
    expect(res.status, 'status da listagem de livros').to.eq(200);
    expect(res.body.books, 'catálogo de livros').to.be.an('array').and.have.length.greaterThan(1);

    res.body.books.forEach((book) => {
      expect(book, 'contrato do livro').to.include.all.keys('isbn', 'title', 'author', 'publisher');
    });

    ctx.availableBooks = res.body.books;
  });
});

When('eu alugar os dois primeiros livros disponíveis', () => {
  ctx.selectedBooks = ctx.availableBooks.slice(0, 2);
  const isbns = ctx.selectedBooks.map((book) => book.isbn);

  cy.log(`Livros escolhidos: ${ctx.selectedBooks.map((b) => b.title).join(' | ')}`);

  bookStoreService.rentBooks(ctx.userId, isbns, ctx.token).then((res) => {
    expect(res.status, 'status do aluguel').to.eq(201);
    expect(res.body.books, 'livros no retorno do aluguel').to.have.length(2);
  });
});

Then('os detalhes do usuário devem conter os {int} livros alugados', (quantidade) => {
  accountService.getUserDetails(ctx.userId, ctx.token).then((res) => {
    expect(res.status, 'status dos detalhes do usuário').to.eq(200);
    expect(res.body.userId, 'id do usuário').to.eq(ctx.userId);
    expect(res.body.username, 'username').to.eq(ctx.user.userName);
    expect(res.body.books, 'quantidade de livros alugados').to.have.length(quantidade);

    const isbnsRetornados = res.body.books.map((b) => b.isbn).sort();
    const isbnsEsperados = ctx.selectedBooks.map((b) => b.isbn).sort();

    expect(isbnsRetornados, 'ISBNs conferem com os alugados').to.deep.eq(isbnsEsperados);
  });
});

After(() => {
  if (!ctx.userId || !ctx.token) return;

  bookStoreService.deleteAllBooks(ctx.userId, ctx.token);
  accountService.deleteUser(ctx.userId, ctx.token);
  cy.log(`Massa de teste removida: ${ctx.userId}`);
});
