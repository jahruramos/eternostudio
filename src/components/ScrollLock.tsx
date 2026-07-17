"use client";

import { RefObject, useEffect } from "react";

export default function ScrollLock({ targetRef }: { targetRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const mql = window.matchMedia("(min-width: 1024px)");

    const onWheel = (e: WheelEvent) => {
      if (!mql.matches) return;
      if (e.deltaY < 0 && el.scrollTop <= 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [targetRef]);

  return null;
}
