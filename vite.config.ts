import { adapter } from "@domcojs/deno";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { domco } from "domco";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [["babel-plugin-react-compiler", {}]];

  if (command === "serve") {
    plugins.push(["@babel/plugin-transform-react-jsx-development", {}]);
  }

  return {
    plugins: [
      react({ babel: { plugins } }),
      domco({ adapter: adapter() }),
      tailwindcss(),
    ],
    resolve: { alias: { "@/": resolve("./src") } },
    /**
     * n.b. something to mess with later
     */
    // build: {
    //   rollupOptions: {
    //     output: {
    //       manualChunks: (id) => {
    //         if (id.includes("react")) return "react";
    //         if (id.includes("react-dom")) return "react-dom";
    //         if (id.includes("three")) return "three";
    //         return null;
    //       },
    //     },
    //   },
    // },
  };
});
