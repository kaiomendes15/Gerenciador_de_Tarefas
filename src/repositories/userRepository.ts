import { prisma } from "../../libs/prisma";
import { Prisma } from "@prisma/client";

export async function createUser(data:Prisma.UserCreateInput) {
    try {
        
        const newUser = await prisma.user.create({ data });
        return newUser;
    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {

            console.log('Email already exists.');
            throw new Error('Email already exists.');
        }

        throw new Error('Failed to create user in database.'); // Erro genérico
    }
    
}