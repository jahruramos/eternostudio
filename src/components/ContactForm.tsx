"use client";

import { useState, type ReactNode } from "react";

const companyTypes = ["Emprendimiento", "Startup", "Empresa", "Otro"];
const serviceOptions = [
  "Branding",
  "Identidad Visual",
  "Consultoría Creativa",
  "Diseño de Website",
  "Diseño Gráfico",
];
const budgets = ["S/.700 a S/.1200", "S/.1200 a S/.2500", "S/.2500 a más"];

const FIELD = "border-b-[0.5px] border-[#7a7a7a] pb-[10px]";
const CONTROL =
  "w-full bg-transparent font-chivo text-[14px] leading-[20px] tracking-[0.28px] outline-none placeholder:uppercase placeholder:text-cream/50";

function Icon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span className={`size-[16.75px] shrink-0 ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full" />
    </span>
  );
}

function Field({ children, wide = false, className = "" }: { children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <label className={`flex items-start justify-between gap-3 ${FIELD} ${wide ? "md:col-span-2" : ""} ${className}`}>
      {children}
    </label>
  );
}

function Select({ name, placeholder, options }: { name: string; placeholder: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <Field>
      <select
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={placeholder}
        className={`${CONTROL} cursor-pointer appearance-none ${value ? "" : "uppercase text-cream/50"}`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-negro normal-case text-cream">
            {o}
          </option>
        ))}
      </select>
      {/* Chevron points left in the source; rotate to point down */}
      <Icon src="/images/icon-chevron.svg" className="pointer-events-none mt-[2px] -rotate-90" />
    </Field>
  );
}

function TextArea({ name, placeholder, className }: { name: string; placeholder: string; className?: string }) {
  return (
    <Field wide className={className}>
      <textarea
        name={name}
        rows={1}
        placeholder={placeholder}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
        className={`${CONTROL} resize-none overflow-hidden`}
      />
      <Icon src="/images/icon-expand.svg" className="rotate-90" />
    </Field>
  );
}

function Input({ name, placeholder, type = "text" }: { name: string; placeholder: string; type?: string }) {
  return (
    <Field>
      <input name={name} type={type} placeholder={placeholder} aria-label={placeholder} className={CONTROL} />
    </Field>
  );
}

export default function ContactForm({ pad }: { pad: string }) {
  return (
    <section
      className="pt-[clamp(96px,9.7vw,187px)]"
      style={{ paddingInline: pad }}
    >
      <h1 className="font-helvetica text-[clamp(40px,4.17vw,80px)] leading-none tracking-[-0.03em]">
        Hablemos.
      </h1>

      {/* Visual only for now — submission is not wired up yet */}
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="mt-[clamp(48px,5vw,97px)] flex flex-col gap-[56px] lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[597px] font-helvetica text-[clamp(20px,1.25vw,24px)] leading-[30px] tracking-[-0.02em]">
            Cuéntanos sobre tu proyecto, tu idea o aquello que estás
            construyendo. Nos gustaría conocerlo y explorar cómo podemos darle
            forma.
          </p>

          <div className="grid w-full grid-cols-1 gap-x-[11px] gap-y-[52px] md:grid-cols-2 lg:max-w-[902px]">
            <Input name="name" placeholder="Nombre y apellido" />
            <Input name="company" placeholder="Empresa" />
            <Input name="email" type="email" placeholder="Correo electrónico" />
            <Input name="phone" type="tel" placeholder="Número de contacto" />
            <Input name="country" placeholder="País" />
            <Select name="companyType" placeholder="¿Qué opción te describe mejor?" options={companyTypes} />
            <TextArea name="about" placeholder="Cuéntanos brevemente sobre tu idea o empresa" className="md:mt-[32px]" />
            <Input name="industry" placeholder="¿A qué industria perteneces?" />
            <Input name="product" placeholder="¿Cuál es tu producto o servicio?" />
            <Select name="service" placeholder="¿Qué servicio necesitas?" options={serviceOptions} />
            <Select name="budget" placeholder="¿Cuánto es tu presupuesto para este proyecto?" options={budgets} />
            <TextArea name="reason" placeholder="¿Por qué requieres de nuestros servicios?" className="md:mt-[45px]" />
          </div>
        </div>

        <div className="mt-[clamp(56px,5vw,97px)] flex justify-end">
          <button
            type="submit"
            className="font-helvetica text-[clamp(28px,2.08vw,40px)] font-medium uppercase leading-none tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Enviar formulario
          </button>
        </div>
      </form>
    </section>
  );
}
