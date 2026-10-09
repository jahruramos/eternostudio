import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import ContactSection from "@/components/ContactSection";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const PAD = "clamp(20px, 6.25vw, 40px)";

async function getWork() {
  const publishedProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder))
    .limit(4);

  return publishedProjects.map((project) => ({
    src: project.thumbnail || "/images/thumb-vitalis.png",
    alt: `${project.title} branding`,
    href: `/work/${project.slug}`,
  }));
}

export default async function Home() {
  const work = await getWork();

  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Hero — wordmark with animated emblem behind + tagline */}
      <main className="flex flex-1 flex-col items-center justify-center pt-[120px]" style={{ paddingInline: PAD }}>
        <div
          className="relative mx-auto flex w-full max-w-[1400px] items-center justify-center"
          aria-label="Eterno Studio"
          role="img"
        >
            {/* eslint-disable @next/next/no-img-element */}
            {/* Animated emblem — sets the stage height, sits behind the wordmark */}
            <div
              className="pointer-events-none w-[37.857%] overflow-hidden rounded-[3px]"
              style={{ aspectRatio: "1 / 1" }}
              aria-hidden
            >
              <img
                src="/images/hero-emblem.gif"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            {/* Wordmark — centered over the emblem, spans full width */}
            <img
              src="/images/hero-wordmark.svg"
              alt="Eterno Studio™"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2"
            />
            {/* eslint-enable @next/next/no-img-element */}
        </div>

        {/* Tagline */}
        <p className="mt-[140px] text-center font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px]">
          Creative Studio &amp;
          <br />
          Strategic Design © 2026
        </p>
      </main>

      {/* About */}
      <section
        id="about"
        className="flex flex-col items-center pb-[clamp(120px,18vh,240px)] pt-[290px] text-center"
        style={{ paddingInline: PAD }}
      >
        <p className="font-chivo text-[12px] uppercase tracking-[0.24px] underline underline-offset-2">
          About
        </p>
        <p className="mt-[clamp(40px,5vw,60px)] max-w-[1206px] font-helvetica text-[clamp(24px,3.6vw,48px)] leading-[1.08] tracking-[-0.03em]">
          Creemos que una marca es{" "}
          <span className="underline underline-offset-[6px]">
            mucho más que un logo.
          </span>{" "}
          Es una idea, un propósito y una promesa. Creemos que el buen diseño no
          solo debe verse bien, sino tener{" "}
          <span className="underline underline-offset-[6px]">
            algo que decir.
          </span>
        </p>
      </section>

      {/* Services */}
      <ServicesSection pad={PAD} />

      {/* Work */}
      <WorkSection pad={PAD} items={work} />

      {/* Work with us */}
      <ContactSection pad={PAD} />

      {/* Footer */}
      <Footer pad={PAD} />
    </div>
  );
}
