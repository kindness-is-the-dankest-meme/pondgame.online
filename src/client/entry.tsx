import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

declare const m: HTMLElementTagNameMap["main"];

const { App } = await import("@/components/App.tsx");

createRoot(m).render(
  <StrictMode>
    <App />
  </StrictMode>
);
