import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TitleMarquee from "@/components/TitleMarquee";
import ServicesAccordion from "@/components/ServicesAccordion";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Services — Eterno Studio™",
};

const PAD = "clamp(20px, 6.25vw, 40px)";

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Title marquee */}
      <div className="pt-[clamp(32px,3.4vw,65px)]">
        <TitleMarquee text="/SERVICES" />
      </div>

      {/* Intro */}
      <section
        className="flex max-w-[1146px] flex-col gap-[clamp(40px,4.3vw,82px)] pt-[clamp(120px,15.7vw,301px)]"
        style={{ paddingInline: PAD }}
      >
        <h1 className="font-helvetica text-[clamp(40px,4.17vw,80px)] leading-none tracking-[-0.03em]">
          Descubrir. Decidir. Diseñar
        </h1>
        <p className="font-helvetica text-[clamp(26px,2.5vw,48px)] leading-none tracking-[-0.03em]">
          Combinamos{" "}
          <span className="underline underline-offset-[0.12em]">
            creatividad con estrategia
          </span>{" "}
          para construir marcas memorables. Acompañamos a marcas en crecimiento a
          construir una{" "}
          <span className="underline underline-offset-[0.12em]">
            identidad clara, consistente y lista para escalar.
          </span>
        </p>
      </section>

      {/* Services */}
      <ServicesAccordion pad={PAD} />

      {/* Work with us */}
      <ContactSection pad={PAD} />

      {/* Footer */}
      <Footer pad={PAD} />
    </div>
  );
}
