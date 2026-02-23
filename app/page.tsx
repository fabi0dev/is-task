import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Organize suas tarefas com{" "}
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            clareza
          </span>
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-lg mx-auto">
          Gerencie projetos e metas em um só lugar. Simples e direto ao ponto.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-semibold text-primary-foreground bg-primary shadow-lg transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
