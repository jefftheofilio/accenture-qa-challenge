import { ENV } from '../config/environment';

/**
 * Service Object da API de BookStore.
 */
class BookStoreService {
  get baseUrl() {
    return ENV.apiUrl;
  }

  listBooks() {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/BookStore/v1/Books`,
      failOnStatusCode: false,
    });
  }

  rentBooks(userId, isbns, token) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/BookStore/v1/Books`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
      failOnStatusCode: false,
    });
  }

  deleteAllBooks(userId, token) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/BookStore/v1/Books?UserId=${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }
}

export default new BookStoreService();