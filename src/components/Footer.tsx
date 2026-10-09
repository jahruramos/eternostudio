const socials = [
  { label: "Instagram", href: "https://www.instagram.com/eterno.std/" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Tik-Tok", href: "https://tiktok.com" },
];

export default function Footer({ pad, className = "" }: { pad: string; className?: string }) {
  return (
    <footer
      className={`flex flex-col gap-4 py-[26px] font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] sm:flex-row sm:items-center sm:justify-between ${className}`}
      style={{ paddingInline: pad }}
    >
      <p className="whitespace-pre-wrap">
        ETERNO STUDIO©2026  Creative Studio &amp; Strategic Design
      </p>
      <div className="flex items-center gap-[27px]">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-[14px]"
          >
            <span className="underline underline-offset-2 transition-opacity duration-200 group-hover:opacity-70">
              {s.label}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/arrow-outward.svg"
              alt=""
              className="size-[20px] shrink-0 transition-transform duration-200 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}
