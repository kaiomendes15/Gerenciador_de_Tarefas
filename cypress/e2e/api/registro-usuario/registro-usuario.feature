Feature: Registro de usuários API

Background: Usuario está na rota de registro
    Given usuário acessa a rota "/api/users"

Scenario Outline: Usuário se registra com campo "nome" vazio.
    When usuario preenche o corpo da requisição
    But o campo "nome" está vazio
    Then sistema retorna uma "<response>"

    Example: 
    |     Response      |
    | Name is required. | 

Scenario Outline: Usuário se registra com campo "nome" possuindo caractéres inválidos.
    When usuario preenche o corpo da requisição
    But o campo "nome" possui um ou mais caracteres inválido
    Then sistema retorna uma "<response>"

    Example: 
    |     Response      |
    | Name cannot contain special characters or numbers. |

Scenario Outline: Usuário se registra com campo "email" vazio ou inválido.
    When usuario preenche o corpo da requisição
    But o campo "email" está vazio ou inválido
    Then sistema retorna uma "<response>"

    Example: 
    |     Response      |
    | Email is invalid. |

Scenario Outline: Usuário se registra com campo "password" vazio.
    When usuario preenche o corpo da requisição
    But o campo "password" está vazio
    Then sistema retorna uma "<response>"

    Example: 
    |             Response                |
    | Password must be at least 6 characters long. |

Scenario Outline: Usuário se registra com campo "password" menor que 6 caracteres.
    When usuario preenche o corpo da requisição
    But o campo "password" possui menos de 6 caracteres
    Then sistema retorna uma "<response>"

    Example: 
    |             Response                |
    | Password must be at least 6 characters long. |

Scenario Outline: Usuário se registra com campo "confirmPassword" vazio.
    When usuario preenche o corpo da requisição
    But o campo "confirmPassword" está vazio
    Then sistema retorna uma "<response>"

    Example: 
    |             Response                |
    | Password must be at least 6 characters long. |

Scenario Outline: Usuário se registra com campo "confirmPassword" menor que 6 caracteres.
    When usuario preenche o corpo da requisição
    But o campo "confirmPassword" possui menos de 6 caracteres
    Then sistema retorna uma "<response>"

    Example: 
    |             Response                |
    | Password must be at least 6 characters long. |

Scenario Outline: Usuário se registra com "password" e "confirmPassword" diferentes.
    When usuario preenche o corpo da requisição
    But os campos "password" e "confirmPassword" são diferentes
    Then sistema retorna uma "<response>"

    Example: 
    |         Response           |
    | Passwords do not match.    |
