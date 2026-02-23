"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "./useLogin";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ControlledInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const { mutateAsync, isPending } = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);

  const { handleSubmit, control } = useForm<LoginFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver overloads conflict with zod 3/4 types
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setApiError(null);
    try {
      const response = await mutateAsync({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo deu errado. Tente novamente.";
      setApiError(message);
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm text-slate-400 transition-colors hover:text-white"
      >
        ← Voltar ao início
      </Link>
      <Card className="w-full max-w-sm border-white/10 bg-card/95 shadow-xl shadow-black/20 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Entrar</CardTitle>
          <CardDescription>
            Use seu e-mail e senha para acessar a conta
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {apiError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {apiError}
              </p>
            )}

            <ControlledInput<LoginFormData>
              control={control}
              name="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={isPending}
            />

            <ControlledInput<LoginFormData>
              control={control}
              name="password"
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isPending}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Entrando…" : "Entrar"}
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              Não tem conta?{" "}
              <Link
                href="/register"
                className="text-indigo-300 font-medium underline-offset-4 hover:underline hover:text-indigo-200"
              >
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
