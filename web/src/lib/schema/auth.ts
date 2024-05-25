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
  corporateAccountNumber: z
    .string()
    .min(1)
    .regex(new RegExp(/^[0-9]+/), "Only number"),
  corporateName: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userRole: z.nativeEnum(UserRole),
  userPhoneNumber: z
    .string()
    .min(1)
    .regex(new RegExp(/^[0-9]+/), "Only number"),
  userEmail: z.string().email(),
  password: z.string().min(1),
  otp: z.string().min(1),
});

export type AuthUser = {
  user: {
    id: string;
    name: string;
    role: string;
    phoneNumber: string;
    email: string;
    corporateAccountNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  corporate: {
    accountNumber: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  lastLoginAt: string;
  errorMessage?: string;
};
