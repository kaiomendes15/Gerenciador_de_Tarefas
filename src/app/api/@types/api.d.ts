// src/types/api.d.ts

// ====== Tipos para Respostas de ERRO de Validação (Zod) ======

// 1. Tipo para os erros de campo (fieldErrors)
// Ex: { name: ['Nome é obrigatório.'], email: ['Email inválido.'] }
interface ApiValidationFieldErrors {
  [key: string]: string[]; // Um objeto onde as chaves são strings (nomes dos campos) e os valores são arrays de strings (as mensagens de erro)
}

// 2. Tipo para os detalhes completos dos erros, como retornado pelo Zod (z.flattenError)
interface ApiErrorDetails {
  formErrors: string[]; // Um array de strings para erros gerais do formulário (que não são de um campo específico)
  fieldErrors: ApiValidationFieldErrors; // O objeto que contém os erros por campo
}

// 3. Tipo para a resposta da API quando a validação falha (status 400)
interface ApiValidationFailedResponse {
  message: 'Validation failed'; // Mensagem principal, exata e literal, para indicar falha de validação
  errors: ApiErrorDetails; // Detalhes completos dos erros de validação
}


// ====== Tipos para Outros Padrões de Resposta da API ======

// 4. Tipo para uma resposta de SUCESSO (status 200, 201)
// T é um tipo genérico que representa os DADOS que vêm na resposta (ex: o objeto do usuário criado)
interface ApiSuccessResponse<T = undefined> { // Use 'undefined' como padrão se a resposta de sucesso pode não ter 'data'
  message: string; // Mensagem de sucesso (ex: 'User created successfully')
  data?: T; // Dados específicos retornados pela API (ex: o objeto do usuário criado)
}

// 5. Tipo para uma resposta de CONFLITO (status 409)
// Usado quando há uma colisão de dados (ex: email já registrado)
interface ApiConflictResponse {
  message: string; // Mensagem exata, ex: 'Email already registered.'
}

// 6. Tipo para uma resposta de ERRO INTERNO DO SERVIDOR (status 500)
// Para erros inesperados no backend
interface ApiInternalServerErrorResponse {
  message: 'Internal server error.'; // Mensagem exata
}

// 7. Tipo de União para QUALQUER Resposta Possível da API
// Este é o tipo que você usará principalmente no frontend para receber as respostas da API
// e no Cypress para tipar 'response.body'.
type ApiResponse<T = undefined> = 
  | ApiSuccessResponse<T>
  | ApiValidationFailedResponse
  | ApiConflictResponse
  | ApiInternalServerErrorResponse;