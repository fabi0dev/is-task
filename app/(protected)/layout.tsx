import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { JSX, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: Props): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return <>{children}</>;
}
