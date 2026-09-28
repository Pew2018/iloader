import { useEffect } from "react";

/** Suppress the WebView menu on app chrome; preserve editing actions in fields. */
export function WebviewInteractions() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);
  return null;
}
