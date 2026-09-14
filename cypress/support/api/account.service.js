/**
 * Service Object da API de Account.
 * Centraliza endpoints, headers e contrato de request.
 * Nenhum step precisa conhecer URL ou formato de payload.
 */
import { ENV } from '../config/environment';

class AccountService {
  get baseUrl() {
    return ENV.apiUrl;
  }

  createUser(userName, password) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/Account/v1/User`,
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  generateToken(userName, password) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/Account/v1/GenerateToken`,
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  isAuthorized(userName, password) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/Account/v1/Authorized`,
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  getUserDetails(userId, token) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }

  deleteUser(userId, token) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }
}

export default new AccountService();
