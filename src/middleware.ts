import middleware from 'next-auth/middleware'

export default middleware // redireciona para a tela de login

// rotas protegidas, usuário comum não consegue acessar
export const config = {
    // |> *: zero ou mais parametros
    // |> +: um ou mais parametros
    // |> ?: zero ou um parametro
    matcher: ['/tasks/:id?'] // middleware só vai ser executado se for nesse path
}