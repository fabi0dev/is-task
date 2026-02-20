import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 dias em segundos

function fromDate(seconds: number, date = Date.now()) {
  return new Date(date + seconds * 1000);
}

async function handler(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  let credentialsSessionToken: string | null = null;

  const options = {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async signIn({
        user,
        account,
      }: {
        user: { id?: string };
        account: { provider?: string } | null;
      }) {
        const adapter = authOptions.adapter;
        if (
          account?.provider === "credentials" &&
          user?.id &&
          adapter
        ) {
          const sessionToken = randomUUID();
          const expires = fromDate(SESSION_MAX_AGE);
          await (adapter as { createSession: (data: { sessionToken: string; userId: string; expires: Date }) => Promise<unknown> }).createSession({
            sessionToken,
            userId: user.id,
            expires,
          });
          credentialsSessionToken = sessionToken;
        }
        return true;
      },
    },
  };

  try {
    const rawResponse = await NextAuth(
      req as NextRequest,
      context as { params: Promise<{ nextauth: string[] }> },
      options
    );
    const response = rawResponse as Response;

    if (credentialsSessionToken && response) {
      const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://");
      const cookieName = useSecureCookies
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";
      const sessionCookie = `${cookieName}=${credentialsSessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${useSecureCookies ? "; Secure" : ""}`;

      const newHeaders = new Headers(response.headers);
      newHeaders.append("Set-Cookie", sessionCookie);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  } catch (error) {
    console.error("[next-auth] Erro na rota de autenticação:", error);
    throw error;
  }
}

export { handler as GET, handler as POST };
