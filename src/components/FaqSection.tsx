"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

const faqs: Faq[] = [
  {
    q: "¿Qué incluye un proyecto de branding?",
    a: "Depende del paquete elegido, pero nuestros proyectos pueden incluir estrategia de marca, investigación, posicionamiento, identidad visual, dirección creativa, sistema gráfico y manual de marca.",
  },
  {
    q: "¿Cuál es la diferencia entre Branding e Identidad Visual?",
    a: "El Branding define la estrategia: propósito, posicionamiento, personalidad y tono de la marca. La Identidad Visual traduce esa estrategia en logotipo, colores, tipografía y sistema gráfico.",
  },
  {
    q: "¿Cuánto dura un proyecto?",
    a: "Depende del alcance. Un proyecto de Identidad toma aproximadamente 3 semanas y uno de Branding alrededor de 5. El Full Package se planifica a medida según los objetivos de cada marca.",
  },
  {
    q: "¿Puedo contratar solo la identidad visual?",
    a: "Sí. Nuestro paquete Identidad está pensado para marcas que ya tienen una estrategia clara y necesitan convertirla en un sistema visual distintivo, coherente y listo para usarse.",
  },
  {
    q: "¿Trabajan con marcas que ya existen?",
    a: "Sí. Trabajamos tanto con marcas nuevas como con marcas que buscan evolucionar. Partimos de una auditoría para entender qué funciona, qué no y hacia dónde debe crecer la marca.",
  },
  {
    q: "¿Cómo es el proceso de trabajo?",
    a: "Seguimos tres etapas: Descubrir, Decidir y Diseñar. Investigamos tu marca y su entorno, definimos juntos la dirección estratégica y luego desarrollamos la identidad hasta su entrega final.",
  },
  {
    q: "¿Cuántas propuestas de logo presentan?",
    a: "Presentamos dos rutas creativas fundamentadas en la estrategia. Elegimos una contigo y la refinamos en rondas de revisión hasta llegar a la versión final de tu identidad visual.",
  },
  {
    q: "¿Cómo se realizan los pagos?",
    a: "Puedes pagar en dos cuotas: 50% al iniciar el proyecto y 50% en la entrega final. Si prefieres pagar al contado, obtienes un 15% de descuento sobre el precio del paquete elegido.",
  },
];

const QUESTION =
  "font-helvetica text-[clamp(22px,1.46vw,28px)] font-medium leading-[40px] tracking-[-0.02em]";

export default function FaqSection({ pad }: { pad: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="flex flex-col gap-[64px] pt-[clamp(140px,16.1vw,309px)] lg:flex-row lg:items-start lg:justify-between lg:gap-[48px]"
      style={{ paddingInline: pad }}
    >
      {/* Intro */}
      <div className="flex max-w-[753px] flex-col gap-[clamp(40px,3.5vw,67px)] lg:w-1/2">
        <h2 className="font-helvetica text-[clamp(44px,3.9vw,75px)] font-medium uppercase leading-[0.97] tracking-[-0.02em]">
          (01)
          <br />
          Preguntas
          <br />
          <span className="pl-[1.96em]">Frecuentes</span>
        </h2>
        <p className="font-helvetica text-[clamp(20px,1.25vw,24px)] leading-[30px] tracking-[-0.02em]">
          Resolvemos las preguntas más frecuentes sobre nuestros procesos,
          servicios y proyectos de branding.
        </p>
      </div>

      {/* Questions */}
      <ul className="flex max-w-[755px] flex-col gap-[21px] lg:w-1/2">
        {faqs.map((f, i) => {
          const open = openIndex === i;
          const panelId = `faq-${i}`;

          return (
            <li key={f.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`text-left transition-opacity duration-200 hover:opacity-70 ${QUESTION}`}
              >
                {f.q}
              </button>
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-[40px] pt-[22px] font-helvetica text-[clamp(20px,1.25vw,24px)] leading-[30px] tracking-[-0.02em]">
                    {f.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
