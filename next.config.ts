import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Garante que .env seja carregado antes do restante da aplicação
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
