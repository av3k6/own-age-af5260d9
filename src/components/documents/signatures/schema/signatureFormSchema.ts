
import { z } from 'zod';

// Form validation schema using Zod
export const signatureFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string(),
  expirationDate: z.date().optional(),
  signers: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
    })
  ).min(1, 'At least one signer is required'),
});
