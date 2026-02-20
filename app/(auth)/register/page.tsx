"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "./useRegister";

export default function Register() {
  const router = useRouter();
  const { mutateAsync, isPending } = useRegister();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    setError(null);

    try {
      const response = await mutateAsync({ email, password });

      if (response.success) {
        router.push("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Loading..." : "Register"}
      </button>

      {error && <p>{error}</p>}
    </>
  );
}
