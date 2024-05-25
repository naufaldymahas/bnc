import { AuthUser } from "@/lib/schema/auth";
import { createContext, useContext } from "react";

export const AuthDefaultValue: AuthUser = {
  user: {
    id: "",
    name: "",
    role: "",
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
