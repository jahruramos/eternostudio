"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";

const PAD = "clamp(20px, 6.25vw, 120px)";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

type Project = {
  overview: string;
  client: string;
  location: string;
  duration: string;
  services: string;
  images: { src: string; alt: string }[];
};

export default function ProjectView({ project }: { project: Project }) {
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let prevY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - prevY;
      prevY = y;
      if (delta > 2) setHeaderHidden(true);
      else if (delta < -2) setHeaderHidden(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col overflow-clip">
      <Navbar pad={PAD} fixed hidden={headerHidden} />

      <main
        className="flex-1"
        style={{ paddingInline: PAD }}
      >
        <div
          className="animate-fade-up grid gap-x-16 gap-y-12 pt-[clamp(60px,9vw,150px)] lg:grid-cols-[1fr_minmax(0,1000px)] lg:pt-[clamp(110px,14vw,220px)]"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Info column */}
          <div className="flex flex-col gap-16 bg-negro lg:sticky lg:top-[clamp(110px,14vw,220px)] lg:self-start lg:z-10">
            <div>
              <p className="text-[16px] tracking-[0.5px] text-[#666]">Overview</p>
              <div className="mt-4 max-w-[490px] text-[16px] leading-[18px] tracking-[0.5px]">
                {project.overview.split("\n\n").filter(Boolean).map((p) => (
                  <p key={p.slice(0, 30)} className="mb-4 last:mb-0">{p}</p>
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
          <GallerySection images={project.images} />
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
