import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        name: 'Pedro Lucas',
        email: 'pedrolucas@email.com',
        passwordHash: 'hashed_password_pedro_lucas', // IMPORTANTE: Não deixe vazio em um app real!
        tasks: {
            create: [
                {
                    title: 'Estudar Next.Js',
                    description: 'Estudar o framework Next.Js',
                    estimatedTime: 2, // Inteiro
                    priority: 'HIGH',
                    dueDate: new Date().toISOString() // <-- CORREÇÃO AQUI
                }
            ]
        }
    },
    {
        name: 'Ana Paula',
        email: 'anapaula@email.com',
        passwordHash: 'hashed_password_ana_paula', // IMPORTANTE: Não deixe vazio!
        tasks: {
            create: [
                {
                    title: 'Revisar TypeScript',
                    description: 'Revisar conceitos básicos e avançados de TypeScript.',
                    estimatedTime: 1, // Inteiro
                    priority: 'MEDIUM',
                    dueDate: new Date().toISOString() // <-- CORREÇÃO AQUI
                },
                {
                    title: 'Planejar semana',
                    description: 'Organizar tarefas e compromissos da semana.',
                    estimatedTime: 1, // <-- CORREÇÃO AQUI: 0.5 não é inteiro, arredondei para 1
                    priority: 'LOW',
                    dueDate: new Date().toISOString() // <-- CORREÇÃO AQUI
                }
            ]
        }
    },
    {
        name: 'João Silva',
        email: 'joaosilva@email.com',
        passwordHash: 'hashed_password_joao_silva', // IMPORTANTE: Não deixe vazio!
        tasks: {
            create: [
                {
                    title: 'Ler documentação Prisma',
                    description: 'Estudar a documentação oficial do Prisma.',
                    estimatedTime: 2, // <-- CORREÇÃO AQUI: 1.5 não é inteiro, arredondei para 2
                    priority: 'HIGH',
                    dueDate: new Date().toISOString() // <-- CORREÇÃO AQUI
                },
                {
                    title: 'Criar projeto teste',
                    description: 'Criar um projeto de teste para praticar Next.js.',
                    estimatedTime: 2, // Inteiro
                    priority: 'MEDIUM',
                    dueDate: new Date().toISOString() // <-- CORREÇÃO AQUI
                }
            ]
        }
    }
];

async function main() {
    console.log(`Start seeding ...`);
    for (const user of userData) {
        const createdUser = await prisma.user.create({
            data: user
        });
        console.log(`Created user with id: ${createdUser.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });