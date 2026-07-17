"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const GallerySection = forwardRef<HTMLDivElement, { images: { src: string; alt: string }[] }>(
  function GallerySection({ images }, forwardedRef) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastImageRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement);

    // Scroll-snap only guarantees a start-aligned stop when the scrollable
    // range reaches it. Once the container is taller than the last image,
    // the browser's natural scroll end (content bottom flush with container
    // bottom) falls short of that point, leaving a sliver of the previous
    // image visible. Padding the bottom by the shortfall makes the last
    // snap point reachable so the scroll always ends exactly there.
    useEffect(() => {
      const container = containerRef.current;
      const lastImage = lastImageRef.current;
      if (!container || !lastImage) return;

      const mql = window.matchMedia("(min-width: 1024px)");

      const updatePadding = () => {
        container.style.paddingBottom = "";
        if (!mql.matches) return;
        if (container.scrollHeight <= container.clientHeight) return;
        const extra = Math.max(0, container.clientHeight - lastImage.clientHeight);
        container.style.paddingBottom = `${extra}px`;
      };

      updatePadding();
      const ro = new ResizeObserver(updatePadding);
      ro.observe(container);
      ro.observe(lastImage);
      mql.addEventListener("change", updatePadding);
      return () => {
        ro.disconnect();
        mql.removeEventListener("change", updatePadding);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="scrollbar-hide flex min-h-0 flex-col gap-[18px] lg:h-full lg:snap-y lg:snap-mandatory lg:overflow-y-auto lg:overscroll-contain"
      >
        {images.map((image, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.src}
            ref={i === images.length - 1 ? lastImageRef : undefined}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="aspect-video w-full shrink-0 rounded-[3px] object-cover lg:snap-start"
          />
        ))}
      </div>
    );
  }
);

export default GallerySection;
