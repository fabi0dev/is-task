"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("E-mail ou senha inválidos. Tente novamente.");
      }

      if (!result?.ok) {
        throw new Error("Algo deu errado. Tente novamente.");
      }

      return { success: true };
    },
  });
}
