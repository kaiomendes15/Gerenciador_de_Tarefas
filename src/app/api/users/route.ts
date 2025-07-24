import * as userService from '@/services/userService'
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { registerUserSchema } from '../schemas/userSchema';
import { z } from 'zod';

export async function POST(request: NextRequest) {
    
    try {
        const body = await request.json();

        // VALIDAR COM ZOD E RETORNAR SE HOUVER ERRO
        const validationResult = registerUserSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = z.flattenError(validationResult.error); // Pega os erros formatados
            const errorMessage: string[] = Object.values(errors.fieldErrors).flat() // array de mensagens de error
            return NextResponse.json(
                { message: errorMessage[0], errors },
                { status: 400 }
            );
        };

        // SE CHEGOU ATÉ AQUI, OS DADOS ESTÃO VÁLIDOS E TIPADOS PELO ZOD
        // Pegue os dados VALIDADOS diretamente de validationResult.data
        const { name, email, password, confirmPassword } = validationResult.data; // << NÃO INCLUA confirmPassword aqui!

        // CHAME O SERVIÇO COM OS DADOS JÁ VALIDADOS
        const newUser = await userService.registerUser({ name, email, password, confirmPassword}); // Passe apenas o que o serviço precisa

        const safeUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        return NextResponse.json({ message: 'User created successfully', user: safeUser }, { status: 201 })

    } catch (error: unknown) {
        console.error('API Error during user registration:', error);

        // **USANDO TYPE GUARDS AQUI:**
        // Primeiro, verifique se é uma instância de 'Error'
        if (error instanceof Error) {
            // Agora TypeScript sabe que 'error' tem uma propriedade 'message'

            if (error.message === 'Email already registered.') {
                return NextResponse.json({ message: error.message }, { status: 409 });
            }
            // Você pode adicionar mais verificações para outras mensagens de erro customizadas

            // Se for um erro conhecido, mas não tratado especificamente para um status code
            // if (error.message.includes('User registration failed:')) {
            //     return NextResponse.json({ message: error.message }, { status: 400 }); // Exemplo
            // }

        } 
        // Se for um erro do Prisma que não foi tratado e propagado como um 'Error' customizado
        else if (error instanceof Prisma.PrismaClientKnownRequestError) {
             // Este bloco é para capturar erros específicos do Prisma diretamente no controller,
             // se eles não forem tratados e re-lançados como 'Error' nas camadas inferiores.
             // No seu caso atual, o repositório e serviço transformam erros Prisma em 'Error'.
             // Mas é uma boa prática para outros casos.
             if (error.code === 'P2002') { // Exemplo: email duplicado
                return NextResponse.json({ message: 'Email already registered.' }, { status: 409 });
            }
            // Outros códigos de erro Prisma...
        }
        
        // Se não for nenhum dos tipos de erro tratados, ou se for um erro completamente inesperado
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}