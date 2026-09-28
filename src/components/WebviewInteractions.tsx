import { useEffect } from "react";

/** Hide the WebView chrome and show a restrained Pixel-era glow at scroll bounds. */
export function WebviewInteractions() {
  useEffect(() => {
    const top = document.createElement("div");
    const bottom = document.createElement("div");
    top.className = "edge-feedback top";
    bottom.className = "edge-feedback bottom";
    top.setAttribute("aria-hidden", "true");
    bottom.setAttribute("aria-hidden", "true");
    document.body.append(top, bottom);
    let timeout: number | undefined;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.deltaY === 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      // Prefer the innermost scrollable area (logs, modal content, or workspace).
      let node: Element | null = target;
      while (node && !(node instanceof HTMLElement &&
        node.scrollHeight > node.clientHeight + 1 &&
        ["auto", "scroll"].includes(getComputedStyle(node).overflowY))) {
        node = node.parentElement;
      }
      if (!(node instanceof HTMLElement)) return;
      const atTop = event.deltaY < 0 && node.scrollTop <= 1;
      const atBottom = event.deltaY > 0 && node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if (!atTop && !atBottom) return;
      const glow = atTop ? top : bottom;
      glow.classList.add("visible");
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        top.classList.remove("visible");
        bottom.classList.remove("visible");
      }, 200);
    };
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target;
      // Preserve native edit actions in text inputs.
      if (target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
    };
    document.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("contextmenu", onContextMenu);
      window.clearTimeout(timeout);
      top.remove();
      bottom.remove();
    };
  }, []);
  return null;
}
