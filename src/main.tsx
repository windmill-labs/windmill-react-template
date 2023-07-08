import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  function render(): void;
}

globalThis.render = () =>
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

if (import.meta.env.MODE === "development") {
  console.log("Running in development mode");
  console.log("Start Render App");
  globalThis.render()
}