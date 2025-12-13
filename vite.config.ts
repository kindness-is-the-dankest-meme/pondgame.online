import { defineConfig } from "vite";
import { resolve } from "@std/path/resolve";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss],
  cacheDir: "node_modules/.vite",
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
});
