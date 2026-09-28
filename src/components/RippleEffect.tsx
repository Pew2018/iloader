import { useEffect } from "react";

/** Bounded Material-era ink: expand from the press point and fade on release. */
export function RippleEffect() {
  useEffect(() => {
    const active = new Map<number, HTMLElement>();
    const keyboard = new Map<HTMLButtonElement, HTMLElement>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const createInk = (button: HTMLButtonElement, x: number, y: number) => {
      if (button.disabled || reducedMotion.matches) return null;
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
      button.appendChild(ink);
      requestAnimationFrame(() => ink.classList.add("expanded"));
      return ink;
    };

    const releaseInk = (ink?: HTMLElement | null) => {
      if (!ink) return;
      ink.classList.add("released");
      window.setTimeout(() => ink.remove(), 400);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const button = (event.target as Element | null)?.closest?.("button");
      if (!(button instanceof HTMLButtonElement)) return;
      const ink = createInk(button, event.clientX, event.clientY);
      if (ink) active.set(event.pointerId, ink);
    };
    const onPointerEnd = (event: PointerEvent) => {
      releaseInk(active.get(event.pointerId));
      active.delete(event.pointerId);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const button = event.target;
      if (!(button instanceof HTMLButtonElement)) return;
      const bounds = button.getBoundingClientRect();
      const ink = createInk(button, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      if (ink) keyboard.set(button, ink);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (!(event.target instanceof HTMLButtonElement)) return;
      releaseInk(keyboard.get(event.target));
      keyboard.delete(event.target);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      active.forEach((ink) => ink.remove());
      keyboard.forEach((ink) => ink.remove());
    };
  }, []);
  return null;
}
