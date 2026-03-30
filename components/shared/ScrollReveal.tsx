"use client";

import { useEffect, useRef, ReactNode } from "react";

// ── Shared IntersectionObserver ──────────────────────────────────────────────
// Instead of creating one IntersectionObserver per ScrollReveal instance,
// we share a single global observer. This significantly reduces memory
// overhead on pages with many animated elements (e.g., template grid).
interface RevealEntry {
  el: HTMLElement;
  delay: number;
}

const globalRevealer = (() => {
  if (typeof window === "undefined") return null;

  let observer: IntersectionObserver | null = null;
  const pending = new Map<HTMLElement, RevealEntry>();

  const flush = (el: HTMLElement, delay: number) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, delay);
  };

  const initObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const data = pending.get(entry.target as HTMLElement);
            if (data) {
              flush(entry.target as HTMLElement, data.delay);
              pending.delete(entry.target as HTMLElement);
            }
            observer!.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
  };

  const observe = (el: HTMLElement, delay: number) => {
    if (!observer) {
      initObserver();
    }
    pending.set(el, { el, delay });
    observer!.observe(el);
  };

  return { observe };
})();

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !globalRevealer) return;

    globalRevealer.observe(el, delay);

    return () => {
      // IntersectionObserver unobserves automatically via the callback above
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
