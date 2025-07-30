import * as userRepository from '../repositories/userRepository'
import bcrypt from "bcrypt";
import { Prisma } from '@prisma/client';

interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
}

export async function registerUser(payload: RegisterUserPayload) {
    const { name, email, password } = payload;
    
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already registered.'); // Mensagem específica
    }

    // hash da senha
    const passwordHash = await bcrypt.hash(password, 10)

    // dados do usuário que serão utilizado no repository
    // utilizados com a ORM
    const userData: Prisma.UserCreateInput = {
        name,
        email,
        passwordHash
    }

    try {
        // Certifique-se de usar 'await' aqui, era um erro na versão anterior
        const newUser = await userRepository.createUser(userData);
        return newUser;
    } catch (error: unknown) { // Use 'unknown' para a variável de erro
        console.error('Service Error: Failed to register user:', error);

        // 5. Propagar a mensagem de erro específica do repositório (se houver)
        if (error instanceof Error) {
            // Re-lança o erro com a mensagem original do repositório
            // Se o repositório lançou 'Failed to create user in database.', esta é a mensagem que será propagada.
            throw new Error(error.message);
        }

        // Se o erro não for uma instância de Error (algo inesperado), lança um erro genérico
        throw new Error('An unexpected error occurred during user registration.');
    }


}