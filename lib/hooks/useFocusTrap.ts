"use client";

import { useEffect, useRef } from "react";

/**
 * Traps keyboard focus within the referenced element while `isActive` is true.
 * Restores focus to the previously focused element when deactivated.
 *
 * Usage:
 *   const modalRef = useFocusTrap(isOpen);
 *   <div ref={modalRef}>...</div>
 */
export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    const getFocusable = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

    const previouslyFocused = document.activeElement as HTMLElement;
    const first = getFocusable()[0];
    if (first) first.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isActive]);

  return ref;
}
