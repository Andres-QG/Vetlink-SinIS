import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Monstserrat Google font
import "@fontsource/montserrat"; // Regular 400 weight
import "@fontsource/montserrat/700.css"; // Optional: bold weight

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
