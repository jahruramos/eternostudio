"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

interface Thumb {
  src: string;
  alt: string;
  href: string;
}

export default function MarqueeStrip({ thumbs }: { thumbs: Thumb[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const speed = 0.5; // px per frame (~30px/s at 60fps)

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function animate() {
      container!.scrollLeft += speed;

      const halfWidth = container!.scrollWidth / 2;
      if (container!.scrollLeft >= halfWidth) {
        container!.scrollLeft -= halfWidth;
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <section
      className="animate-fade-up w-full overflow-hidden pt-[130px]"
      style={{ animationDelay: "0.8s" }}
    >
      <div
        ref={containerRef}
        className="scrollbar-hide overflow-x-auto cursor-grab active:cursor-grabbing"
      >
        <div className="flex w-max">
          {[...thumbs, ...thumbs, ...thumbs, ...thumbs, ...thumbs, ...thumbs, ...thumbs, ...thumbs].map((thumb, i) => {
            const imgClass =
              "mr-[15px] h-[clamp(200px,23vw,300px)] w-[clamp(166.67px,19.17vw,250px)] shrink-0 rounded-[3px] object-cover transition-[width] duration-500 ease-out hover:w-[clamp(280px,32.2vw,420px)]";

            return (
              <Link
                key={i}
                href={thumb.href}
                aria-hidden={i >= thumbs.length}
                tabIndex={i >= thumbs.length ? -1 : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb.src} alt={thumb.alt} className={imgClass} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
