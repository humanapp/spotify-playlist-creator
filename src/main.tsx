import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssVarsProvider } from "@mui/joy/styles";
import "@fontsource/inter"; // If you chose Fontsource for the Inter font
import "./index.scss";
import * as spotify from "./services/spotify";
import { AppStateProvider } from "./state/Context";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssVarsProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </CssVarsProvider>
  </StrictMode>
);

window.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname === "/auth/callback") {
    await spotify.authCallbackAsync();
  }
});
