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
    n: "001",
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
    n: "002",
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
    n: "003",
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
    n: "004",
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
                className={`flex items-start text-left transition-opacity duration-200 ${
                  i === activeIndex ? "opacity-100" : "opacity-20 hover:opacity-60"
                }`}
              >
                <span className="w-[clamp(60px,10vw,153px)] shrink-0 font-chivo text-[12px] tracking-[0.24px]">
                  {s.n}
                </span>
                <span className="font-helvetica text-[clamp(32px,4vw,54px)] font-medium leading-[0.95] tracking-[-0.03em]">
                  {s.name}
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
