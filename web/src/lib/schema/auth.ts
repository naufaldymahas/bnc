import { z } from "zod";

export const LoginSchema = z.object({
  corporateAccountNumber: z.string().min(1),
  userId: z.string().min(1),
  password: z.string().min(1),
});

export enum UserRole {
  Maker = "maker",
  Approver = "approver",
}

export const RegisterSchema = z.object({
  corporateAccountNumber: z.string().min(1),
  corporateName: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userRole: z.nativeEnum(UserRole),
  userPhoneNumber: z.string().min(1),
  userEmail: z.string().email(),
  password: z.string().min(1),
  otp: z.string().min(1),
});
