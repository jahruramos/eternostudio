"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/", match: (p: string) => p === "/" },
  { label: "Work", href: "/work", match: (p: string) => p.startsWith("/work") },
  { label: "About", href: "#", match: () => false },
  { label: "Services", href: "/services", match: (p: string) => p.startsWith("/services") },
];

export default function Navbar({
  pad,
  fixed,
  hidden,
}: {
  pad: string;
  fixed?: boolean;
  hidden?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={`z-50 flex items-center justify-between gap-4 pb-[clamp(28px,5vh,60px)] pt-[clamp(18px,calc(5vh-10px),50px)] font-chivo text-[12px] uppercase tracking-[0.24px] transition-transform duration-300 ${
        fixed ? "relative lg:fixed lg:inset-x-0 lg:top-0 lg:bg-negro" : "relative"
      } ${hidden ? "lg:-translate-y-full" : "lg:translate-y-0"}`}
      style={{ paddingInline: pad }}
    >
      {/* Desktop links */}
      <nav className="hidden items-center gap-[30px] md:flex">
        {navLinks.map((link) => {
          const active = link.match(pathname);
          return (
            <a
              key={link.label}
              href={link.href}
              className={`transition-opacity duration-200 ${
                active
                  ? "underline underline-offset-2 opacity-100"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <a
        href="#"
        className="hidden whitespace-nowrap underline underline-offset-2 opacity-100 transition-opacity duration-200 hover:opacity-70 md:block"
      >
        Start a project
      </a>

      {/* Mobile: brand + hamburger */}
      <span className="font-chivo text-sm uppercase tracking-[0.24px] md:hidden">
        Eterno Studio™
      </span>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex size-8 flex-col items-center justify-center gap-[5px] md:hidden"
      >
        <span
          className={`block h-[1.5px] w-6 bg-cream transition-transform ${
            open ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-6 bg-cream transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-6 bg-cream transition-transform ${
            open ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile overlay menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-negro md:hidden"
          style={{ paddingInline: pad }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-chivo text-3xl uppercase tracking-[0.24px] ${
                link.match(pathname) ? "underline underline-offset-4" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setOpen(false)}
            className="mt-4 font-chivo text-3xl uppercase tracking-[0.24px] underline underline-offset-4 opacity-70"
          >
            Start a project
          </a>
        </div>
      )}
    </header>
  );
}
