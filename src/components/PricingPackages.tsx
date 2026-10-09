"use client";

import { useState } from "react";

// Paying up front takes this much off the installment price
const UPFRONT_DISCOUNT = 0.2;

type Package = {
  name: string;
  subtitle: string;
  duration: string;
  description: string;
  includes: string[];
  featured?: boolean;
} & (
  | { price: number; custom?: never }
  | { price?: never; custom: { label: string; value: string; note: string } }
);

const packages: Package[] = [
  {
    name: "Identidad",
    subtitle: "Identidad Visual",
    duration: "Aprox. 3 sem.",
    description:
      "Para marcas que buscan convertir una estrategia clara en una identidad visual distintiva, coherente y memorable.",
    includes: [
      "Investigación y Análisis",
      "Dirección creativa",
      "Logotipo",
      "Sistema tipográfico",
      "Colores de Marca",
      "Sistema visual",
      "Guía de Estilo",
    ],
    price: 500,
  },
  {
    name: "Branding",
    subtitle: "Branding + Identidad Visual",
    duration: "Aprox. 5 sem.",
    description:
      "Para quienes necesitan definir el propósito, posicionamiento y dirección de una marca antes de llevarla a lo visual.",
    includes: [
      "Todo Identidad",
      "Investigación y análisis",
      "ADN de marca",
      "Posicionamiento",
      "Personalidad y tono",
      "Concepto estratégico",
      "Manual de Marca",
    ],
    price: 1100,
    featured: true,
  },
  {
    name: "Full Package",
    subtitle: "Paquete personalizado",
    duration: "Aprox. 3 sem.",
    description:
      "Para proyectos que buscan construir una marca completa, preparada para crecer, comunicar y permanecer.",
    includes: [
      "Todo Identidad",
      "Todo Branding",
      "Estudio de Mercado",
      "Entrevista a clientes",
      "Estrategia de contenidos",
      "Múltiples piezas gráficas",
      "Acompañamiento (3 Meses)",
    ],
    custom: {
      label: "Paquete",
      value: "A medida",
      note: "Contacta directamente con Eterno Studio.",
    },
  },
];

const LABEL =
  "font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2";
const CARD_LABEL =
  "font-chivo text-[10px] uppercase leading-[16.5px] tracking-[0.2px] underline underline-offset-2";

export default function PricingPackages({ pad }: { pad: string }) {
  const [upfront, setUpfront] = useState(false);

  return (
    <section className="flex flex-col items-center" style={{ paddingInline: pad }}>
      {/* Payment toggle — installments (left) / up front (right) */}
      <div className="flex items-center gap-[24px]">
        <button
          type="button"
          onClick={() => setUpfront(false)}
          className={`${LABEL} transition-opacity duration-200 ${upfront ? "opacity-50 hover:opacity-100" : ""}`}
        >
          Pago en cuotas
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={upfront}
          aria-label="Pago al contado"
          onClick={() => setUpfront((v) => !v)}
          className="relative h-[46px] w-[101px] shrink-0 rounded-full border border-[#d9d9d9]"
        >
          <span
            className={`absolute left-[7px] top-1/2 size-[34px] -translate-y-1/2 rounded-full bg-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              upfront ? "translate-x-[53px]" : "translate-x-0"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => setUpfront(true)}
          className={`${LABEL} transition-opacity duration-200 ${upfront ? "" : "opacity-50 hover:opacity-100"}`}
        >
          Pago al contado
        </button>
      </div>

      {/* Package cards */}
      <div className="mt-[clamp(80px,6.86vw,132px)] grid w-full max-w-[540px] grid-cols-1 gap-[12px] xl:max-w-[1510px] xl:grid-cols-3">
        {packages.map((p) => {
          const price = p.custom
            ? p.custom.value
            : `$${Math.round(upfront ? p.price * (1 - UPFRONT_DISCOUNT) : p.price)}`;
          const note = p.custom
            ? p.custom.note
            : upfront
              ? "Pago al contado."
              : "Pago en dos cuotas.";

          const border = p.featured ? "border-cream" : "border-[#3a3a3a]";

          return (
            <article
              key={p.name}
              className={`flex flex-col border p-[clamp(20px,1.5vw,29px)] ${border}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className={CARD_LABEL}>Plan</span>
                <span className={CARD_LABEL}>{p.duration}</span>
              </div>
              <h3 className="mt-[26px] font-helvetica text-[clamp(40px,3.23vw,62px)] font-medium leading-[0.9] tracking-[-0.02em]">
                {p.name}
              </h3>
              <p className="mt-[20px] font-helvetica text-[clamp(18px,1.03vw,20px)] leading-[1.1] tracking-[-0.02em]">
                {p.subtitle}
              </p>

              {/* Description + includes */}
              <p className="mt-[50px] font-helvetica text-[clamp(16px,0.95vw,18px)] leading-[20.7px] tracking-[-0.02em]">
                {p.description}
              </p>
              <ul className="mt-[32px] font-helvetica text-[clamp(16px,0.95vw,18px)] leading-[33px] tracking-[-0.02em]">
                {p.includes.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>

              {/* Price — pushed down so all cards line up */}
              <div className="mt-auto pt-[55px]">
                <p className={CARD_LABEL}>{p.custom ? p.custom.label : "Desde"}</p>
                <p
                  className="mt-[23px] font-helvetica text-[clamp(52px,4.3vw,83px)] font-medium leading-none tracking-[-0.02em] tabular-nums"
                  aria-live="polite"
                >
                  {price}
                </p>
                <p className="mt-[20px] font-helvetica text-[15px] leading-[21px] tracking-[-0.02em]">
                  {note}
                </p>
              </div>

              {/* CTA */}
              <a
                href="mailto:hello@eternostd.com"
                className={`mt-[clamp(40px,3.6vw,69px)] flex items-center justify-center border py-[clamp(24px,2.07vw,40px)] font-helvetica text-[clamp(18px,1.12vw,21.5px)] font-medium uppercase leading-none tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70 ${border}`}
              >
                Start a project
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
