"use client";

import { useState, type ReactNode } from "react";

type Service = {
  n: string;
  name: string;
  description: ReactNode;
  includes: string[];
};

const services: Service[] = [
  {
    n: "01",
    name: "Branding",
    description: (
      <>
        Realizamos un proceso de branding completo y asertivo mediante{" "}
        <span className="underline underline-offset-2">
          análisis e investigación
        </span>{" "}
        con el objetivo de desarrollar un concepto y personalidad innovadora.
      </>
    ),
    includes: [
      "Análisis e Investigación",
      "Brand Strategy",
      "Dirección Creativa",
      "Identidad Visual",
      "Manual de Marca",
    ],
  },
  {
    n: "02",
    name: "Identidad Visual",
    description:
      "Creamos sistemas visuales coherentes y distintivos que traducen la esencia de una marca en una identidad reconocible y memorable.",
    includes: [
      "Concepto Visual",
      "Logotipo",
      "Sistema Tipográfico",
      "Paleta de Color",
      "Sistema Gráfico",
      "Aplicaciones",
    ],
  },
  {
    n: "03",
    name: "Consultoría Creativa",
    description:
      "Analizamos tu marca desde una perspectiva estratégica y creativa para encontrar oportunidades, mejorar su dirección y potenciar su comunicación.",
    includes: [
      "Auditoría de Marca",
      "Análisis Visual",
      "Dirección Creativa",
      "Estrategia de Comunicación",
      "Recomendaciones",
      "Acompañamiento Creativo",
    ],
  },
  {
    n: "04",
    name: "Diseño Gráfico",
    description:
      "Desarrollamos piezas gráficas que llevan la identidad de tu marca a distintos puntos de contacto, manteniendo coherencia y carácter.",
    includes: [
      "Campañas",
      "Redes Sociales",
      "Editorial",
      "Packaging",
      "Presentaciones",
      "Piezas Publicitarias",
    ],
  },
];

export default function ServicesSection({ pad }: { pad: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const service = services[activeIndex];
  const half = Math.ceil(service.includes.length / 2);
  const includesA = service.includes.slice(0, half);
  const includesB = service.includes.slice(half);

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
            <li key={s.n}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-pressed={i === activeIndex}
                className={`group text-left transition-opacity duration-300 ${
                  i === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              >
                <span className="flex items-baseline transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[clamp(8px,0.8vw,16px)] font-helvetica text-[clamp(32px,4vw,54px)] font-medium uppercase leading-[0.95] tracking-[-0.03em]">
                  <span className="w-[clamp(80px,8vw,154px)] shrink-0">
                    ({s.n})
                  </span>
                  <span>{s.name}</span>
                </span>
              </button>
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
              {service.description}
            </p>
          </div>

          <div className="flex w-full justify-between gap-8 font-helvetica text-[clamp(18px,1.6vw,24px)] font-light leading-[1.42] tracking-[-0.01em]">
            <ul>
              {includesA.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <ul className="pr-[clamp(0px,4vw,60px)]">
              {includesB.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
