import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "sonner";
import { StoreProvider } from "./StoreContext";
import { LogProvider } from "./LogContext";
import { ErrorProvider } from "./ErrorContext";
import { DialogProvider } from "./DialogContext";
import "./i18next";
import { PlatformProvider } from "./PlatformContext";
import { RippleEffect } from "./components/RippleEffect";
import { WebviewInteractions } from "./components/WebviewInteractions";
import { ThemeController } from "./ThemeController";
import "./theme.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlatformProvider>
      <StoreProvider>
        <ThemeController />
        <ErrorProvider>
          <DialogProvider>
            <LogProvider>
              <App />
            </LogProvider>
          </DialogProvider>
        </ErrorProvider>
      </StoreProvider>
    </PlatformProvider>
    <RippleEffect />
    <WebviewInteractions />
    <Toaster richColors expand />
  </React.StrictMode>,
);
