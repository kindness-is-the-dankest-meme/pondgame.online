import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

declare const m: HTMLElement;

createRoot(m).render(<App />);
