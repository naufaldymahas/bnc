import { z } from "zod";

export const LoginSchema = z.object({
  corporateAccountNumber: z.string().min(1),
  userId: z.string().min(1),
  password: z.string().min(1),
});
