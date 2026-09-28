import { useEffect } from "react";

/** A small Material-era touch ripple, without replacing existing controls. */
export function RippleEffect() {
  useEffect(() => {
    const addRipple = (button: HTMLButtonElement, x: number, y: number) => {
      if (button.disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = button.getBoundingClientRect();
      const localX = x - bounds.left;
      const localY = y - bounds.top;
      const radius = Math.max(
        Math.hypot(localX, localY),
        Math.hypot(bounds.width - localX, localY),
        Math.hypot(localX, bounds.height - localY),
        Math.hypot(bounds.width - localX, bounds.height - localY),
      );
      const ink = document.createElement("span");
      ink.className = "ripple-ink";
      ink.setAttribute("aria-hidden", "true");
      ink.style.width = ink.style.height = `${radius * 2}px`;
      ink.style.left = `${localX - radius}px`;
      ink.style.top = `${localY - radius}px`;
      ink.addEventListener("animationend", () => ink.remove(), { once: true });
      button.appendChild(ink);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const button = (event.target as Element | null)?.closest?.("button");
      if (button instanceof HTMLButtonElement) addRipple(button, event.clientX, event.clientY);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const button = event.target;
      if (!(button instanceof HTMLButtonElement)) return;
      const bounds = button.getBoundingClientRect();
      addRipple(button, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
