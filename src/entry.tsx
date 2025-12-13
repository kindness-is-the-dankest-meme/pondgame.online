import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

declare const m: HTMLElementTagNameMap["main"];

createRoot(m).render(
  <StrictMode>
    <h1>Pond Game</h1>
  </StrictMode>
);
