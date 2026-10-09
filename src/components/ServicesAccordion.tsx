"use client";

import { useState } from "react";

type ServiceDetail = {
  includes: string[];
  description: string;
  image?: string;
  video?: { mp4: string; webm: string; poster: string };
};

type Service = {
  n: string;
  name: string;
  detail: ServiceDetail;
};

const services: Service[] = [
  {
    n: "01",
    name: "Branding",
    detail: {
      includes: [
        "Diagnóstico de marca",
        "Análisis de competencia",
        "Definición de público objetivo",
        "Posicionamiento y propuesta de valor",
        "Personalidad, tono y voz de marca",
        "Naming y tagline (opcional)",
        "Documento de estrategia de marca",
      ],
      description:
        "Construimos marcas con propósito, desde la estrategia hasta la forma en que se expresan. Definimos quién eres, a quién le hablas y por qué deberían elegirte.",
      image: "/images/services-branding.gif",
    },
  },
  {
    n: "02",
    name: "Identidad Visual",
    detail: {
      includes: [
        "Logotipo y variantes",
        "Paleta de colores",
        "Tipografía",
        "Recursos gráficos",
        "Aplicaciones",
        "Manual de marca",
      ],
      description:
        "Traducimos la esencia de tu marca en un sistema visual coherente, reconocible y listo para usarse en cualquier formato.",
      video: {
        mp4: "/videos/services-identidad.mp4",
        webm: "/videos/services-identidad.webm",
        poster: "/videos/services-identidad-poster.jpg",
      },
    },
  },
  {
    n: "03",
    name: "Consultoría Creativa",
    detail: {
      includes: [
        "Sesiones uno a uno",
        "Auditoría de marca",
        "Dirección creativa",
        "Plan de acción",
        "Seguimiento",
      ],
      description:
        "Te acompañamos a tomar mejores decisiones de marca y diseño. Una mirada externa y estratégica para ordenar ideas, detectar oportunidades y trazar el camino.",
      image: "/images/services-consultoria.jpg",
    },
  },
  {
    n: "04",
    name: "Diseño Gráfico",
    detail: {
      includes: [
        "Redes sociales",
        "Piezas publicitarias",
        "Diseño editorial",
        "Packaging",
        "Material impreso",
      ],
      description:
        "Piezas que comunican con claridad y mantienen tu marca consistente en cada punto de contacto, digital o impreso.",
      image: "/images/services-diseno.jpg",
    },
  },
];

export default function ServicesAccordion({ pad }: { pad: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="flex flex-col gap-[clamp(24px,2.35vw,45px)] pb-[118px] pt-[clamp(120px,11.8vw,226px)]"
      style={{ paddingInline: pad }}
    >
      {services.map((s, i) => {
        const open = openIndex === i;
        const title = (
          <span className="flex items-baseline transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[clamp(8px,0.8vw,16px)] font-helvetica text-[clamp(36px,3.9vw,75px)] font-medium uppercase leading-[0.9] tracking-[-0.02em]">
            <span className="w-[clamp(80px,8vw,154px)] shrink-0">({s.n})</span>
            <span>{s.name}</span>
          </span>
        );

        const panelId = `service-panel-${s.n}`;

        return (
          <div key={s.n}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              aria-controls={panelId}
              className={`group text-left transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              {title}
            </button>

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-[48px] pb-[clamp(64px,6.9vw,133px)] pt-[clamp(40px,4.2vw,80px)] lg:flex-row lg:items-stretch lg:justify-between lg:pl-[clamp(80px,7.8vw,150px)] lg:pr-[20px]">
                  {/* Includes — numbered list */}
                  <ol className="w-full max-w-[444px] font-chivo text-[12px] uppercase leading-[30px] tracking-[0.24px]">
                    {s.detail.includes.map((item, j) => (
                      <li key={j} className="flex">
                        <span className="w-[153px] shrink-0 underline underline-offset-2">
                          ({String(j + 1).padStart(2, "0")})
                        </span>
                        <span className="underline underline-offset-2">{item}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Description + CTA */}
                  <div className="flex w-full max-w-[433px] flex-col justify-between gap-[40px]">
                    <p className="font-helvetica text-[clamp(18px,1.15vw,22px)] font-light leading-[30px] tracking-[-0.01em]">
                      {s.detail.description}
                    </p>
                    <a
                      href="/contact"
                      className="self-start font-helvetica text-[clamp(22px,1.35vw,26px)] font-medium uppercase leading-none tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                    >
                      Start a project
                    </a>
                  </div>

                  {/* Visual — video, image, or gray placeholder */}
                  <div
                    className="w-full max-w-[467px] shrink-0 overflow-hidden bg-cream/10"
                    style={{ aspectRatio: "467 / 347" }}
                  >
                    {s.detail.video ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={s.detail.video.poster}
                        className="size-full object-cover"
                        aria-hidden
                      >
                        <source src={s.detail.video.webm} type="video/webm" />
                        <source src={s.detail.video.mp4} type="video/mp4" />
                      </video>
                    ) : s.detail.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.detail.image}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
