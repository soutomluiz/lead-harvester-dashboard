import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command }) => ({
  server: {
    port: 8080,
    host: true,
    allowedHosts: [
      "7911f724-ed05-4f52-ba62-b417fae909bc.lovableproject.com"
    ],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));