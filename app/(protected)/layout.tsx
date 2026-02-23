import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { JSX, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: Props): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950/50 to-slate-900">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              is-task
            </span>
          </Link>
          <span className="text-muted-foreground text-sm">
            {session.user?.email}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
