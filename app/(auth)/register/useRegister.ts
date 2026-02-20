"use client";

import { useMutation } from "@tanstack/react-query";
import { createUser } from "./actions/createUser";

interface RegisterInput {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: async (data) => createUser(data),
  });
}