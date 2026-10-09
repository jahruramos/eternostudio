"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";

const PAD = "clamp(20px, 6.25vw, 40px)";

const LABEL =
  "font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2";
const VALUE = "font-helvetica text-[18px] leading-[25px] tracking-[-0.03em]";

// Underline the project name when the overview opens with it
function withUnderlinedTitle(text: string, title: string) {
  if (!title || !text.startsWith(title)) return text;
  return (
    <>
      <span className="underline underline-offset-[3px]">{title}</span>
      {text.slice(title.length)}
    </>
  );
}

type Project = {
  title: string;
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
        <div className="grid gap-x-[clamp(32px,4vw,64px)] gap-y-12 pt-[clamp(60px,9vw,150px)] lg:grid-cols-[minmax(0,765fr)_minmax(0,1055fr)] lg:gap-x-0 lg:pt-[clamp(110px,11.6vw,222px)]">
          {/* Info column — overview on top, meta pinned to the bottom of the viewport */}
          <div className="flex flex-col justify-between gap-[64px] bg-negro lg:sticky lg:top-[clamp(110px,11.6vw,222px)] lg:z-10 lg:min-h-[calc(100svh-clamp(110px,11.6vw,222px)-46px)] lg:self-start lg:pr-[clamp(32px,4vw,64px)]">
            <div>
              <p className={LABEL}>Overview</p>
              <div className="mt-[31px] max-w-[597px] font-helvetica text-[20px] leading-[25px] tracking-[-0.013em]">
                {project.overview.split("\n\n").filter(Boolean).map((p, i) => (
                  <p key={i} className="mb-[25px] last:mb-0">
                    {i === 0 ? withUnderlinedTitle(p, project.title) : p}
                  </p>
                ))}
              </div>
              <Link
                href="/work"
                className={`mt-[120px] inline-block transition-opacity duration-200 hover:opacity-70 ${LABEL}`}
              >
                Back
              </Link>
            </div>

            <div className="flex flex-col gap-[52px]">
              <div className="grid grid-cols-[repeat(3,minmax(0,153px))]">
                {[
                  { label: "Cliente", value: project.client },
                  { label: "Location:", value: project.location },
                  { label: "Duration:", value: project.duration },
                ]
                  .filter((f) => f.value)
                  .map((f) => (
                    <div key={f.label} className="pr-4">
                      <p className={LABEL}>{f.label}</p>
                      <p className={`mt-[15px] ${VALUE}`}>{f.value}</p>
                    </div>
                  ))}
              </div>

              {project.services && (
                <div>
                  <p className={LABEL}>Services:</p>
                  <p className={`mt-[15px] max-w-[444px] ${VALUE}`}>{project.services}</p>
                </div>
              )}
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
