"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";

const PAD = "clamp(20px, 6.25vw, 40px)";

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
        <div className="grid gap-x-16 gap-y-12 pt-[clamp(60px,9vw,150px)] lg:grid-cols-[1fr_minmax(0,1000px)] lg:pt-[clamp(110px,14vw,220px)]">
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

      <Footer pad={PAD} />
    </div>
  );
}
