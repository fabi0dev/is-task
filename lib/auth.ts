import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

if (!secret && process.env.NODE_ENV !== "test") {
  throw new Error(
    "NEXTAUTH_SECRET não está definido. Adicione NEXTAUTH_SECRET no arquivo .env"
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return user;
      },
    }),
    // Necessário para permitir strategy "database" com Credentials (NextAuth exige outro provider além de credentials)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "dummy",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  secret,
};