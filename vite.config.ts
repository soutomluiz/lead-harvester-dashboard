import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: [
      "7911f724-ed05-4f52-ba62-b417fae909bc.lovableproject.com",
    ],
    host: true,
    port: 8080,
  },
  build: {
    outDir: "dist", // 🔹 Define explicitamente que a pasta de saída é 'dist'
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
