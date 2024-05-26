import { AuthUser, UserRole } from "@/lib/schema/auth";
import { createContext, useContext } from "react";

export const AuthDefaultValue: AuthUser = {
  user: {
    id: "",
    name: "",
    role: UserRole.Maker,
    phoneNumber: "",
    email: "",
    corporateAccountNumber: "",
    createdAt: "",
    updatedAt: "",
  },
  corporate: {
    accountNumber: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  },
  accessToken: "",
  lastLoginAt: "",
};
export const AuthContext = createContext(AuthDefaultValue);
export const useAuthContext = () => {
  return useContext(AuthContext);
};
