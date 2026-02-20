"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

interface CreateUserInput {
  email: string;
  password: string;
}

interface CreateUserResponse {
  success: boolean;
  message?: string;
}

export async function createUser(
  input: CreateUserInput
): Promise<CreateUserResponse> {
  const { email, password } = input;

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return {
      success: false,
      message: "User already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
}