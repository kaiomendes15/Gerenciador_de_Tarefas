import * as userRepository from '../repositories/userRepository'
import bcrypt from "bcrypt";
import { Prisma } from '@prisma/client';

interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export async function registerUser(payload: RegisterUserPayload) {
    const { name, email, password, confirmPassword } = payload;

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

        const newUser = userRepository.createUser(userData)
        return newUser
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Registration failed: ${error.message}`)
        }

        throw new Error(`Registration failed: ${error}`)

    }


}