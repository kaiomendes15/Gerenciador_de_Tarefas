import * as userService from '@/services/userService'
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { registerUserSchema } from '../schemas/registerSchema';
import { z } from 'zod';

export async function POST(request: NextRequest) {
    
    try {
        const body = await request.json();

        // VALIDAR COM ZOD E RETORNAR SE HOUVER ERRO
        const validationResult = registerUserSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = z.flattenError(validationResult.error); // Pega os erros formatados
            // const errorMessage: string[] = Object.values(errors.fieldErrors).flat() // Esta linha não é mais necessária para a 'message' principal

            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: {
                        formErrors: errors.formErrors,
                        fieldErrors: errors.fieldErrors
                    }
                } as ApiValidationFailedResponse, // Use o tipo para o cast seguro
                { status: 400 }
            );
        };


        // SE CHEGOU ATÉ AQUI, OS DADOS ESTÃO VÁLIDOS E TIPADOS PELO ZOD
        const { name, email, password } = validationResult.data;

        const newUser = await userService.registerUser({ name, email, password });

        const safeUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        return NextResponse.json(
            { message: 'User created successfully', data: { user: safeUser } } as ApiSuccessResponse<{ user: typeof safeUser }>, // Use o tipo para o cast seguro
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('API Error during user registration:', error);

        // **USANDO TYPE GUARDS AQUI:**
        // Primeiro, verifique se é uma instância de 'Error'
        if (error instanceof Error) {
            if (error.message === 'Email already registered.') {
                return NextResponse.json(
                    { message: 'Email already registered.' } as ApiConflictResponse,
                    { status: 409 }
                );
            }
        } 
        // Se for um erro do Prisma que não foi tratado e propagado como um 'Error' customizado
        else if (error instanceof Prisma.PrismaClientKnownRequestError) {
             
             if (error.code === 'P2002') { // Erro de violação de unique constraint (ex: email duplicado)
                return NextResponse.json(
                    // AQUI: Apenas a propriedade 'message', conforme ApiConflictResponse
                    { message: 'Email already registered.' } as ApiConflictResponse,
                    { status: 409 }
                );
            };
        }
        
        // Se não for nenhum dos tipos de erro tratados, ou se for um erro completamente inesperado
        return NextResponse.json(
            { message: 'Internal server error.' } as ApiInternalServerErrorResponse,
            { status: 500 }
        );
    }
}