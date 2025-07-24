import * as userService from '@/services/userService'
import { containsSpecialCharacters } from '@/utils/validation';
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
            return NextResponse.json(
                { message: 'Validation failed', errors },
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

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            if (error.message.includes('Email already exists.')) {
                return NextResponse.json({ message: error.message }, { status: 409 });
            }
            if (error.message.includes('Passwords do not match.')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
        }

        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}