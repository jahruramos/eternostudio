"use client";

import { useRef } from "react";
import ScrollLock from "@/components/ScrollLock";

export default function GallerySection({ images }: { images: { src: string; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollLock targetRef={ref} />
      <div ref={ref} className="scrollbar-hide flex flex-col gap-[18px] lg:h-full lg:overflow-y-auto lg:overscroll-contain">
        {images.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="aspect-video w-full rounded-[3px] object-cover"
          />
        ))}
      </div>
    </>
  );
}
