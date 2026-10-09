const services = [
  { n: "001", name: "Branding" },
  { n: "002", name: "Identidad Visual" },
  { n: "003", name: "Consultoría Creativa" },
  { n: "004", name: "Diseño Gráfico" },
];

const activeIndex = 0;

const deliverablesA = [
  "Análisis e Investigación",
  "Brand Strategy",
  "Dirección Creativa",
];
const deliverablesB = ["Identidad Visual", "Manual de Marca"];

export default function ServicesSection({ pad }: { pad: string }) {
  return (
    <section
      id="services"
      className="pb-[clamp(120px,18vh,240px)] pt-[clamp(80px,12vh,160px)]"
      style={{ paddingInline: pad }}
    >
      <p className="font-chivo text-[12px] uppercase tracking-[0.24px] underline underline-offset-2">
        services
      </p>

      <div className="mt-[clamp(56px,9vw,129px)] flex flex-col gap-[clamp(56px,7vw,80px)] lg:flex-row lg:items-stretch lg:justify-between">
        {/* Left — service list (auto-distributed, min 36px between rows) */}
        <ul className="flex flex-col justify-between gap-[36px] lg:gap-0">
          {services.map((s, i) => (
            <li
              key={s.n}
              className={`flex items-start ${i === activeIndex ? "" : "opacity-20"}`}
            >
              <span className="w-[clamp(60px,10vw,153px)] shrink-0 font-chivo text-[12px] tracking-[0.24px]">
                {s.n}
              </span>
              <span className="font-helvetica text-[clamp(32px,4vw,54px)] font-medium leading-[0.95] tracking-[-0.03em]">
                {s.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Right — active service detail */}
        <div className="flex w-full max-w-[748px] flex-col gap-[35px] lg:pr-[clamp(0px,8vw,155px)]">
          <div className="flex flex-col gap-[34px]">
            <p className="font-chivo text-[12px] uppercase tracking-[0.24px]">
              The service
            </p>
            <p className="font-helvetica text-[clamp(18px,1.6vw,24px)] font-light leading-[1.08] tracking-[-0.01em]">
              Realizamos un proceso de branding completo y asertivo mediante{" "}
              <span className="underline underline-offset-2">
                análisis e investigación
              </span>{" "}
              con el objetivo de desarrollar un concepto y personalidad
              innovadora.
            </p>
          </div>

          <div className="flex w-full justify-between gap-8 font-helvetica text-[clamp(18px,1.6vw,24px)] font-light leading-[1.42] tracking-[-0.01em]">
            <ul>
              {deliverablesA.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <ul className="pr-[clamp(0px,4vw,60px)]">
              {deliverablesB.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
