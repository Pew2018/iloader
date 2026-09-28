import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useStore } from "./StoreContext";

export type Appearance = "system" | "light" | "dark";

/** Keep the WebView and native title bar in sync with the saved preference. */
export function ThemeController() {
  const [appearance] = useStore<Appearance>("appearance", "system");
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    setSystemDark(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const selected: Appearance =
      appearance === "light" || appearance === "dark" ? appearance : "system";
    const resolved = selected === "system" ? (systemDark ? "dark" : "light") : selected;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    getCurrentWindow()
      .setTheme(selected === "system" ? null : selected)
      .catch((error) => console.warn("Unable to update native window theme", error));
  }, [appearance, systemDark]);

  return null;
}
