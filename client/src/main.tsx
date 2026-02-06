import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize sound settings (best-effort). Audio playback still requires
// a user gesture in most browsers.
import { isSoundEnabled } from "@/lib/sound";

isSoundEnabled();

createRoot(document.getElementById("root")!).render(<App />);
