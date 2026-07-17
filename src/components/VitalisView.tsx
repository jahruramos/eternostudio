"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";

const PAD = "clamp(20px, 6.25vw, 120px)";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

type Project = {
  overview: string[];
  client: string;
  location: string;
  duration: string;
  services: string;
  images: { src: string; alt: string }[];
};

export default function VitalisView({ project }: { project: Project }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);

  // Desktop only: a single wheel input, wherever the cursor is, drives the
  // gallery first. Only once the gallery has nowhere left to go in that
  // direction does the event fall through to the page's own (tiny) native
  // scroll, which is just enough to reveal the footer below.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

    const onWheel = (e: WheelEvent) => {
      if (!mql.matches) return;
      const gallery = galleryRef.current;
      if (!gallery) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      if (scrollingDown) setHeaderHidden(true);
      else if (scrollingUp) setHeaderHidden(false);

      const atGalleryBottom = gallery.scrollTop >= gallery.scrollHeight - gallery.clientHeight - 1;
      const atGalleryTop = gallery.scrollTop <= 0;
      const pageScrolled = window.scrollY > 0;

      if (scrollingDown && !atGalleryBottom) {
        gallery.scrollBy({ top: e.deltaY, behavior: "auto" });
        e.preventDefault();
      } else if (scrollingUp && !pageScrolled && !atGalleryTop) {
        gallery.scrollBy({ top: e.deltaY, behavior: "auto" });
        e.preventDefault();
      }
      // else: let the native page scroll handle it (reveal/hide the footer).
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="flex flex-col overflow-clip">
      <Navbar pad={PAD} fixed hidden={headerHidden} />

      <main
        className="animate-fade-up flex-1 pt-[clamp(60px,9vw,150px)] lg:h-screen lg:grow-0 lg:basis-auto lg:overflow-hidden lg:pt-[clamp(110px,14vw,220px)]"
        style={{ paddingInline: PAD, animationDelay: "0.5s" }}
      >
        <div className="grid gap-x-16 gap-y-12 lg:h-full lg:min-h-0 lg:grid-cols-[1fr_minmax(0,1000px)]">
          {/* Info column */}
          <div className="flex flex-col gap-16 lg:h-full lg:min-h-0 lg:overflow-hidden">
            <div>
              <p className="text-[16px] tracking-[0.5px] text-[#666]">Overview</p>
              <div className="mt-4 flex max-w-[490px] flex-col gap-4 text-[16px] leading-[18px] tracking-[0.5px]">
                {project.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Cliente</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.client}</p>
              </div>
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Location:</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.location}</p>
              </div>
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Duration:</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.duration}</p>
              </div>
            </div>

            <div>
              <p className="text-[16px] tracking-[0.5px] text-[#666]">Services:</p>
              <p className="mt-4 max-w-[150px] text-[16px] tracking-[1px]">{project.services}</p>
            </div>
          </div>

          {/* Gallery column */}
          <GallerySection ref={galleryRef} images={project.images} />
        </div>
      </main>

      <footer
        className="animate-fade-up flex flex-col gap-4 pb-[clamp(24px,5vh,56px)] pt-[clamp(28px,5vh,60px)] text-[12px] sm:flex-row sm:items-end sm:justify-between"
        style={{ paddingInline: PAD, animationDelay: "0.8s" }}
      >
        <p className="tracking-[0.42px]">
          ETERNO STUDIO©2026&nbsp;&nbsp;Creative Studio &amp; Strategic Design
        </p>
        <div className="flex items-center gap-[clamp(16px,2vw,36px)]">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 uppercase relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-cream after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
            >
              {s.label}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/arrow-outward.svg" alt="" className="size-[1.4em]" />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
