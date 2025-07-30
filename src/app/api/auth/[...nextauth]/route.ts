import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as userRepository from '@/repositories/userRepository';
import bcrypt from "bcrypt";
import { prisma } from "../../../../../libs/prisma";

export const googleAuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
            email: { label: "Email", type: "email", placeholder: "your_email@email.com" },
            password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // Add logic here to look up the user from the credentials supplied
                
                    // Any object returned will be saved in `user` property of the JWT
                    // return user
                    // If you return null then an error will be displayed advising the user to check their details.
                    // return null
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter

                // verifica se tudo foi preenchido corretamente
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                // recebe as credenciais
                const email = String(credentials.email)
                const password = String(credentials.password)

                // busca o usuario com o email dado
                const user = await userRepository.findUserByEmail(email) // usuario no banco ou null caso não exista

                if (!user || !user.passwordHash) {
                    // - !user.passwordHash -> usuário pode ter realizado login social com o email passado no formulário, se ele nunca realizou login pelo formulário, então ele não possui uma hash salva.
                    return null
                }

                const isHashValid = await bcrypt.compare(password, user.passwordHash);

                if (isHashValid) {
                    // ESTE É O OBJETO QUE O NEXTAUTH.JS USA PARA CONSTRUIR A SESSÃO E O JWT INTERNO
                    return user
                } 

                return null
                
            }
        }),
        GoogleProvider({
            // o valor não pode ser undefined
            // typescript não sabe se as variáveis de ambiente realmente existem, então ele marca como erro
            // colocar a "!" na variável é o mesmo que dizer para o typescript que ela existe. (se não existir no .env, vai dar erro)
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            clientId: process.env.GOOGLE_CLIENT_ID!

        })
        
    ],
    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(googleAuthOptions);

export { handler as GET, handler as POST }
// Função Principal: Quando qualquer requisição (GET, POST, etc.) chega a /api/auth ou qualquer uma de suas sub-rotas, o Next.js passa essa requisição para o seu handler.
