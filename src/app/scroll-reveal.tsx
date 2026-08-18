"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealVariant =
  | "rise"
  | "route"
  | "card"
  | "checkpoint"
  | "message"
  | "rule";

type RevealStyle = CSSProperties & {
  "--reveal-delay": string;
};

type ScrollRevealProps = Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}>;

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "rise",
}: ScrollRevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = revealRef.current;
    if (!reveal) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      reveal.dataset.revealState = "visible";
      return;
    }

    const bounds = reveal.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.9) {
      reveal.dataset.revealState = "visible";
      return;
    }

    reveal.dataset.revealState = "pending";
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        frame = requestAnimationFrame(() => {
          reveal.dataset.revealState = "visible";
        });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    observer.observe(reveal);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const style: RevealStyle = {
    "--reveal-delay": `${Math.max(0, delay)}ms`,
  };

  return (
    <div
      className={`scroll-reveal ${className}`.trim()}
      data-reveal-state="visible"
      data-reveal-variant={variant}
      data-scroll-reveal=""
      ref={revealRef}
      style={style}
    >
      {children}
    </div>
  );
}
