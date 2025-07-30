// src/schemas/userSchema.ts
import { containsSpecialCharacters } from '@/utils/validation';
import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string()
    .trim()
    .nonempty('Name is required.') // Mensagem para string vazia
    .refine(
      (name) => !containsSpecialCharacters(name), { // A negação está correta aqui
        message: 'Name cannot contain special characters or numbers.',
    }),
  email: z.string().email('Email is invalid.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters long.'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;