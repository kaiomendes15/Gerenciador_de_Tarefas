import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            // o valor não pode ser undefined
            // typescript não sabe se as variáveis de ambiente realmente existem, então ele marca como erro
            // colocar a "!" na variável é o mesmo que dizer para o typescript que ela existe. (se não existir no .env, vai dar erro)
            clientId: process.env.GOOGLE_CLIENT_ID!, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
});

export { handler as GET, handler as POST }
// Função Principal: Quando qualquer requisição (GET, POST, etc.) chega a /api/auth ou qualquer uma de suas sub-rotas, o Next.js passa essa requisição para o seu handler.
