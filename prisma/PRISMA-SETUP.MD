## Guia Detalhado: Instalação e Configuração do Prisma ORM e Suas Dependências

Este guia foca nos passos exatos para integrar o Prisma ORM ao seu projeto Next.js e conectar-se ao seu banco de dados PostgreSQL remoto.

### Pré-requisitos (Revisado)

  * Projeto Next.js já criado e configurado (com `app router`, TypeScript).
  * URL de Conexão do seu banco de dados PostgreSQL remoto (ex: Vercel Postgres, Supabase, Neon).

-----

### Fase 2: Instalação e Configuração Inicial do Prisma (Detalhado)

Esta fase é onde você introduz o Prisma ao seu projeto e o conecta ao seu banco de dados.

1.  **Instale as Dependências Principais do Prisma:**

      * Abra o terminal na raiz do seu projeto (onde está o `package.json`).
      * Execute o seguinte comando para instalar o CLI do Prisma (`prisma`) e o Prisma Client (`@prisma/client`):
        ```bash
        npm install prisma @prisma/client
        # Ou, se você usa Yarn:
        # yarn add prisma @prisma/client
        ```
          * **`prisma`:** É a CLI (Command Line Interface) do Prisma, usada para gerar o cliente, rodar migrações, inspecionar o banco de dados, etc.
          * **`@prisma/client`:** É o pacote que contém o cliente JavaScript/TypeScript gerado, que você usará no seu código para interagir com o banco de dados.

2.  **Inicialize o Prisma no Seu Projeto:**

      * No terminal, ainda na raiz do seu projeto, execute:
        ```bash
        npx prisma init
        ```
      * **O que este comando faz?**
          * Cria uma nova pasta chamada `prisma/` na raiz do seu projeto.
          * Dentro da pasta `prisma/`, ele cria o arquivo `schema.prisma`. Este é o arquivo principal onde você definirá seus modelos de dados.
          * Cria (ou adiciona a) um arquivo `.env` na raiz do seu projeto, com uma variável de ambiente `DATABASE_URL` (com um placeholder).

3.  **Configure a Variável de Ambiente `DATABASE_URL` no `.env`:**

      * Abra o arquivo `.env` que foi criado (ou atualizado) na raiz do seu projeto.
      * Substitua o valor de `DATABASE_URL` pela **Connection String** do seu banco de dados PostgreSQL remoto que você obteve do seu provedor (Vercel Postgres, Supabase, etc.). Certifique-se de que o valor esteja entre aspas duplas.
        ```dotenv
        # .env
        DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public"
        ```
          * **Atenção:** Se sua Connection String já contém `?schema=public` (ou outro schema), mantenha-o. Caso contrário, adicione `?schema=public` no final da URL para garantir que o Prisma se conecte ao schema padrão.
          * **Por que isso é crucial?** O Prisma lê essa variável para saber a qual banco de dados ele deve se conectar para todas as suas operações (migrações, queries, seeding, etc.).

4.  **Defina Seus Modelos de Dados no `schema.prisma`:**

      * Abra o arquivo `prisma/schema.prisma`.
      * Você verá a configuração inicial do `datasource` e `generator`.
      * **Verifique `datasource db`:** Confirme se o `provider` está definido como `"postgresql"`.
        ```prisma
        // prisma/schema.prisma

        datasource db {
          provider = "postgresql" // Garanta que esteja como "postgresql"
          url      = env("DATABASE_URL")
        }

        generator client {
          provider = "prisma-client-js"
        }

        // ... aqui virão seus modelos e enums
        ```
      * **Adicione Seus Modelos e Enums:** Agora, você pode adicionar as definições dos seus modelos `User` e `Task`, e os enums `TaskStatus` e `TaskPriority`, conforme o schema que já definimos juntos.
          * Preste atenção aos tipos de campo (`String`, `Int`, `DateTime`, `Boolean`) e às diretivas (`@id`, `@default`, `@unique`, `@updatedAt`, `@map`).
          * **Exemplo dos modelos:**
            ```prisma
            // ... (parte superior do schema.prisma)

            model User {
              id           Int       @id @default(autoincrement())
              email        String    @unique
              passwordHash String    @map("password_hash")
              name         String?
              createdAt    DateTime  @default(now())
              updatedAt    DateTime  @updatedAt
              // tasks        Task[] // Linha para relacionamento, opcional por enquanto
            }

            model Task {
              id             Int          @id @default(autoincrement())
              title          String       @db.VarChar(255)
              description    String?
              createdAt      DateTime     @default(now())
              dueDate        DateTime
              estimatedTime  Int?
              status         TaskStatus   @default(OPEN)
              priority       TaskPriority @default(LOW)
              // author         User?        @relation(fields: [authorId], references: [id])
              // authorId       Int?
            }

            enum TaskStatus {
              OPEN
              IN_PROGRESS
              COMPLETED
              OVERDUE
            }

            enum TaskPriority {
              LOW
              MEDIUM
              HIGH
              CRITICAL
            }
            ```

5.  **Gere o Prisma Client:**

      * Após definir seu `schema.prisma`, execute o comando:
        ```bash
        npx prisma generate
        ```
      * **Para que serve?** Este comando lê seu `schema.prisma` e:
          * Gera o código TypeScript para o `@prisma/client`. Isso inclui todos os métodos CRUD para seus modelos (`prisma.user.findMany()`, `prisma.task.create()`, etc.).
          * **Gera os tipos TypeScript** para seus modelos e suas operações (como `Prisma.UserCreateInput`, `Prisma.TaskUpdateInput`, etc.). Isso é o que fornece o autocompletar e a segurança de tipo na sua IDE, ajudando a evitar erros antes de rodar o código.
          * **Importante:** Sempre que você fizer alterações no seu `schema.prisma`, você precisará rodar `npx prisma generate` novamente para atualizar o cliente e os tipos.

6.  **Execute as Migrações para Criar as Tabelas no Banco de Dados:**

      * Este é o **passo mais crítico** para fazer as suas definições de schema existirem no banco de dados.
      * Execute no terminal:
        ```bash
        npx prisma migrate dev --name init_app_tables
        ```
      * **Por que esse comando é ESSENCIAL?**
          * Você teve o erro "The table `public.User` does not exist...". Isso aconteceu porque, embora você tenha **definido** a tabela no `schema.prisma`, ela ainda não havia sido **criada fisicamente** no seu banco de dados PostgreSQL.
          * `npx prisma migrate dev`: Compara seu `schema.prisma` com o estado atual do seu banco de dados.
          * Se encontrar diferenças (como a falta das tabelas `User` e `Task`), ele:
              * Gera um arquivo SQL com os comandos necessários (`CREATE TABLE`, `CREATE ENUM`, etc.) dentro da pasta `prisma/migrations/`.
              * **Aplica esse arquivo SQL** ao seu banco de dados remoto, criando as tabelas e os enums.
              * **Automaticamente executa `npx prisma generate`** novamente (o que é ótimo, pois garante que seu cliente esteja sempre atualizado após uma migração).
          * O argumento `--name init_app_tables` é um nome descritivo para essa migração, que aparecerá no histórico de migrações.

-----