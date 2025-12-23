import { App } from "@/components/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

declare const m: HTMLElementTagNameMap["main"];

createRoot(m).render(
  <StrictMode>
    <App />
  </StrictMode>
);
