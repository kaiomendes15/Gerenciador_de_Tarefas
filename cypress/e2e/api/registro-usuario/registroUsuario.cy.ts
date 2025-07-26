/// <reference types="cypress" />
import '../../../support/api-commands'

describe('Testa o registro de usuários na API', () => {

  context('Registros falhos', () => {

    // Adicione o type guard aqui, fora dos 'it', para reuso
    function isApiValidationErrorResponse(
      responseBody: ApiRegisterResponseBody
    ): responseBody is ApiValidationErrorResponse {
      return (
        (responseBody as ApiValidationErrorResponse).message === 'Validation failed' &&
        (responseBody as ApiValidationErrorResponse).errors !== undefined
      );
    }

    it('Usuário se registra com campo "nome" vazio.', () => {
      cy.registroApi("", "teste@email.com", "123456", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.name?.[0]).to.eq('Name is required.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "nome" possuindo caracteres inválidos.', () => {
      cy.registroApi("teste12-+a", "valido@email.com", "123456", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.name?.[0]).to.eq('Name cannot contain special characters or numbers.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "email" vazio.', () => {
      cy.registroApi("nomevalido", "", "123456", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.email?.[0]).to.eq('Email is invalid.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "email" inválido.', () => {
      cy.registroApi("nomevalido", "emailinvalido", "123456", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.email?.[0]).to.eq('Email is invalid.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "password" vazio.', () => {
      cy.registroApi("nomevalido", "teste@email.com", "", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.password?.[0]).to.eq('Password must be at least 6 characters long.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "password" menor que 6 caracteres.', () => {
      cy.registroApi("nomevalido", "teste@email.com", "123", "123").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.password?.[0]).to.eq('Password must be at least 6 characters long.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "confirmPassword" vazio.', () => {
      cy.registroApi("nomevalido", "teste@email.com", "123456", "").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.confirmPassword?.[0]).to.eq('Invalid input');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com campo "confirmPassword" menor que 6 caracteres.', () => {
      cy.registroApi("nomevalido", "teste@email.com", "123456", "123").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.confirmPassword?.[0]).to.eq('Password must be at least 6 characters long.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    it('Usuário se registra com "password" e "confirmPassword" diferentes.', () => {
      cy.registroApi("nomevalido", "teste@email.com", "123457", "123456").then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Validation failed');
        if (isApiValidationErrorResponse(response.body)) {
          // CORREÇÃO: Acesse o primeiro elemento do array de mensagens e use 'eq'
          expect(response.body.errors.fieldErrors.confirmPassword?.[0]).to.eq('As senhas não coincidem.');
        } else {
          throw new Error("Unexpected API response for validation error.");
        }
      });
    });

    // Teste para email duplicado (este deve retornar 409, não 400)
    it('should return 409 for duplicate email registration', () => {
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;
      const password = 'password123';

      cy.registroApi("Primeiro User", duplicateEmail, password, password).then((firstResponse) => {
        expect(firstResponse.status).to.eq(201);
        expect(firstResponse.body.message).to.eq('User created successfully');
      });

      cy.registroApi("Segundo User", duplicateEmail, password, password).then((secondResponse) => {
        expect(secondResponse.status).to.eq(409);
        expect(secondResponse.body).to.have.property('message', 'Email already registered.');
      });
    });

  });
});