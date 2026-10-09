"use client";

export default function GallerySection({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="flex flex-col">
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="w-full"
        />
      ))}
    </div>
  );
}
