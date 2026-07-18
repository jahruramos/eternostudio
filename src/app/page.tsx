import Navbar from "@/components/Navbar";
import MarqueeStrip from "@/components/MarqueeStrip";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/eterno.std/" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

const PAD = "clamp(20px, 6.25vw, 120px)";

async function getThumbs() {
  const publishedProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder));

  return publishedProjects.map((project) => ({
    src: project.thumbnail || "/images/thumb-vitalis.png",
    alt: `${project.title} branding`,
    href: `/work/${project.slug}`,
  }));
}

export default async function Home() {
  const thumbs = await getThumbs();

  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Hero wordmark */}
      <main className="flex flex-1 items-end" style={{ paddingInline: PAD }}>
        <div
          className="animate-logo relative w-full"
          style={{ aspectRatio: "1680 / 212.42" }}
          aria-label="Eterno Studio"
          role="img"
        >
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="/images/wordmark-eterno.svg"
            alt=""
            className="absolute"
            style={{ left: "0%", top: "1.62%", width: "44.17%", height: "98.38%" }}
          />
          <img
            src="/images/wordmark-studio.svg"
            alt=""
            className="absolute"
            style={{ left: "48.59%", top: "0%", width: "44.96%", height: "101.66%" }}
          />
          <img
            src="/images/wordmark-tm.svg"
            alt=""
            className="absolute"
            style={{ left: "95%", top: "27.21%", width: "5%", height: "18.98%" }}
          />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </main>

      {/* Thumbnail strip — auto-scroll + manual scroll on hover */}
      <MarqueeStrip thumbs={thumbs} />

      {/* Footer */}
      <footer
        className="animate-fade-up flex flex-col gap-4 pb-[clamp(24px,5vh,56px)] pt-[clamp(28px,5vh,60px)] text-[12px] sm:flex-row sm:items-end sm:justify-between"
        style={{ paddingInline: PAD, animationDelay: "1.1s" }}
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
