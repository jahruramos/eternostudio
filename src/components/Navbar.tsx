"use client";

import { useState } from "react";

const navLinks = ["Home", "Work", "About", "Contact"];

export default function Navbar({ pad }: { pad: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="animate-fade-in relative z-50 flex items-center justify-between gap-4 pt-[clamp(28px,5vh,60px)]"
      style={{ paddingInline: pad, animationDelay: "0.3s" }}
    >
      {/* Desktop links */}
      <nav className="hidden items-center gap-[clamp(14px,2vw,34px)] text-[14px] font-medium uppercase tracking-[0.32px] md:flex">
        {navLinks.map((link) => (
          <a key={link} href="#" className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-cream after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100">
            {link}
          </a>
        ))}
      </nav>
      <a
        href="#"
        className="hidden whitespace-nowrap text-[14px] font-medium uppercase tracking-[0.32px] relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-cream after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 md:block"
      >
        Start a project
      </a>

      {/* Mobile: brand + hamburger */}
      <span className="text-sm font-medium uppercase tracking-[0.32px] md:hidden">
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
              key={link}
              href="#"
              onClick={() => setOpen(false)}
              className="text-3xl font-medium uppercase tracking-[0.32px]"
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setOpen(false)}
            className="mt-4 text-3xl font-medium uppercase tracking-[0.32px] opacity-60"
          >
            Start a project
          </a>
        </div>
      )}
    </header>
  );
}
