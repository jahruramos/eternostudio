const contactLines = [
  { label: "SAN BORJA, LIMA - PE." },
  { label: "+51 902 065 575", href: "tel:+51902065575" },
  { label: "hello@eternostd.com", href: "mailto:hello@eternostd.com", gapBefore: true },
  { label: "@eterno.std", href: "https://www.instagram.com/eterno.std/", gapBefore: true },
];

export default function ContactSection({ pad }: { pad: string }) {
  return (
    <section
      id="contact"
      className="flex flex-col gap-[80px] pb-[173px] pt-[150px]"
      style={{ paddingInline: pad }}
    >
      <p className="font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2">
        Work with us
      </p>

      <div className="flex flex-col gap-[clamp(56px,7vw,80px)] lg:flex-row lg:items-end lg:justify-between">
        {/* Left — headline + prompt */}
        <div className="flex max-w-[750px] flex-col gap-[clamp(40px,5.2vw,99px)]">
          <h2 className="font-helvetica text-[clamp(40px,4.6vw,68px)] font-medium leading-[0.956] tracking-[-0.02em]">
            Let’s create
            <br />
            something that lasts.
          </h2>
          <p className="font-helvetica text-[clamp(24px,2.6vw,40px)] leading-none tracking-[-0.03em]">
            ¿Tienes una idea, una marca por construir o algo que llevar al
            siguiente nivel?
          </p>
        </div>

        {/* Right — contact details + CTA */}
        <div className="flex flex-col items-start gap-[clamp(48px,5vw,100px)] lg:items-end lg:text-right">
          <ul className="font-chivo text-[12px] leading-[20px] tracking-[0.24px]">
            {contactLines.map((line) => (
              <li key={line.label} className={line.gapBefore ? "mt-[20px]" : ""}>
                {line.href ? (
                  <a
                    href={line.href}
                    target={line.href.startsWith("http") ? "_blank" : undefined}
                    rel={line.href.startsWith("http") ? "noreferrer" : undefined}
                    className="transition-opacity duration-200 hover:opacity-70"
                  >
                    {line.label}
                  </a>
                ) : (
                  line.label
                )}
              </li>
            ))}
          </ul>
          <a
            href="mailto:hello@eternostd.com"
            className="font-helvetica text-[clamp(28px,2.6vw,40px)] font-medium uppercase leading-[1.05] tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Start a project
          </a>
        </div>
      </div>
    </section>
  );
}
