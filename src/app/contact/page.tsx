import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TitleMarquee from "@/components/TitleMarquee";
import ContactForm from "@/components/ContactForm";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Contact — Eterno Studio™",
};

const PAD = "clamp(20px, 6.25vw, 40px)";
const BOOKING_URL = "https://calendly.com/alfonsoramosur/30min";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Title marquee */}
      <div className="pt-[clamp(32px,3.4vw,65px)]">
        <TitleMarquee text="/CONTACT" />
      </div>

      {/* Form */}
      <ContactForm pad={PAD} />

      {/* Call booking — copy overlaps the image on desktop */}
      <section
        className="grid grid-cols-1 gap-[48px] pt-[clamp(160px,18.4vw,354px)] lg:grid-cols-[1070fr_751fr] lg:gap-0"
        style={{ paddingInline: PAD }}
      >
        <div className="relative z-10 flex flex-col lg:max-w-[66.2%] items-start gap-[clamp(40px,4vw,78px)] lg:col-[1/3] lg:row-[1]">
          <p className="font-chivo text-[12px] uppercase leading-[20px] tracking-[0.24px] underline underline-offset-2">
            Nos gustaría conocerte
          </p>
          <p className="font-helvetica text-[clamp(26px,2.5vw,48px)] leading-none tracking-[-0.03em]">
            Agenda una{" "}
            <span className="underline underline-offset-[0.12em]">
              llamada gratuita de 30 minutos
            </span>{" "}
            para contarnos sobre tu marca, tus objetivos y lo que estás buscando
            construir.{" "}
            <span className="underline underline-offset-[0.12em]">
              Sin compromiso,
            </span>{" "}
            solo una primera conversación para entender cómo podemos ayudarte.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="font-helvetica text-[clamp(28px,2.08vw,40px)] font-medium uppercase leading-none tracking-[-0.02em] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
          >
            Agendar ahora
          </a>
        </div>

        <div
          className="w-full overflow-hidden lg:col-[2/3] lg:row-[1]"
          style={{ aspectRatio: "751 / 558" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/contact-call.jpg"
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      </section>

      {/* Work with us */}
      <ContactSection pad={PAD} />

      {/* Footer */}
      <Footer pad={PAD} />
    </div>
  );
}
