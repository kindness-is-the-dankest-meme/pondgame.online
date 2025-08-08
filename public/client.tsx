import { createRoot } from "https://esm.sh/react-dom/client";
import { App } from "./App.tsx";

declare const m: HTMLElement;

createRoot(m).render(<App />);
