"use client";

import { useEffect, useRef } from "react";

export default function GallerySection({ images }: { images: { src: string; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      el.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={ref}
      className="scrollbar-hide flex flex-col gap-[18px] overflow-y-auto snap-y snap-mandatory"
    >
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="aspect-video w-full snap-start rounded-[3px] object-cover"
        />
      ))}
    </div>
  );
}
