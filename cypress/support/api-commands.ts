// cypress/support/custom-commands.d.ts

/// <reference types="cypress" />

// 1. Defina o tipo para o objeto de usuário seguro retornado em caso de sucesso
interface ApiRegisteredUser {
  // ATENÇÃO: Conforme seu JSON, o ID está vindo como número (12).
  // Para NextAuth.js funcionar, ele precisa ser String.
  // Tipando como 'number' para coincidir com seu output atual.
  // VOCÊ DEVE RESOLVER ISSO NO SEU SCHEMA/DB (id: String @id @default(cuid()))
  id: number; // <--- TEMPORARIAMENTE number, DEVE SER string PARA NEXTAUTH.JS
  name: string | null;
  email: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

// 2. Defina o tipo para a resposta de sucesso da API de registro
interface ApiRegisterSuccessResponse {
  message: 'User created successfully'; // Mensagem exata
  user: ApiRegisteredUser;
}

// 3. Defina o tipo para os erros de validação de campo do Zod (exact match)
interface ZodFieldErrors {
  [key: string]: string[]; // Ex: { name: ['Name is required.'], email: ['Email is invalid.'] }
}

// 4. Defina o tipo para o objeto de erros completo retornado pelo Zod FlattenError
interface ZodFlattenedErrors {
  formErrors: string[]; // No seu caso, sempre vazio.
  fieldErrors: ZodFieldErrors;
}

// 5. Defina o tipo para a resposta de erro de validação da API
interface ApiValidationErrorResponse {
  message: 'Validation failed';
  errors: ZodFlattenedErrors; // <--- Corrigido para corresponder à sua saída
}

// 6. Defina o tipo para a resposta de erro de email duplicado (conflito)
interface ApiConflictErrorResponse {
  message: 'Email already registered.'; // Mensagem exata do seu serviço
}

// 7. Crie um tipo de união para todas as possíveis respostas do corpo da API de registro
type ApiRegisterResponseBody =
  | ApiRegisterSuccessResponse
  | ApiValidationErrorResponse
  | ApiConflictErrorResponse
  | { message: string }; // Para outros erros (ex: 500 Internal Server Error)

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    registroApi(
      name: string | null | undefined, // Nome pode ser nulo/indefinido para testes de falha
      email: string,
      password: string,
      confirmPassword: string
    ): Chainable<Response<ApiRegisterResponseBody>>;
  }
}

Cypress.Commands.add('registroApi',
    (name, email, password, confirmPassowrd) => {
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: { name, email, password, confirmPassowrd },
            failOnStatusCode: false
        })
    })