"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor-hover]';

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursor.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(var(--cursor-scale))`;
    };

    const hover = (e: MouseEvent) => {
      const target = e.target as Element | null;
      el.classList.toggle("is-hover", !!target?.closest?.(INTERACTIVE));
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", hover, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
    };
  }, []);

  return <div ref={cursor} className="custom-cursor" />;
}
