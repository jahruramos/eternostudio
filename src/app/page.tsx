import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/eterno.std/" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

const PAD = "clamp(20px, 6.25vw, 50px)";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Hero — wordmark with animated emblem behind + tagline */}
      <main className="flex flex-1 flex-col items-center justify-center pt-[215px]" style={{ paddingInline: PAD }}>
        <div
          className="animate-logo relative mx-auto flex w-full max-w-[1400px] items-center justify-center"
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
        <p
          className="animate-fade-up mt-[70px] pb-[clamp(8px,2vh,24px)] text-center font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px]"
          style={{ animationDelay: "0.8s" }}
        >
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
