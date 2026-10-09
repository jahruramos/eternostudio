import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TitleMarquee from "@/components/TitleMarquee";
import PricingPackages from "@/components/PricingPackages";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Precios — Eterno Studio™",
};

const PAD = "clamp(20px, 6.25vw, 40px)";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Title marquee */}
      <div className="pt-[clamp(32px,3.4vw,65px)]">
        <TitleMarquee text="/PRECIOS /PAQUETES" />
      </div>

      {/* Intro */}
      <section
        className="mx-auto flex max-w-[1321px] flex-col items-center gap-[clamp(40px,4.3vw,82px)] pb-[clamp(64px,6.9vw,132px)] pt-[clamp(120px,11.6vw,223px)] text-center"
        style={{ paddingInline: PAD }}
      >
        <h1 className="font-helvetica text-[clamp(40px,4.17vw,80px)] leading-none tracking-[-0.03em]">
          Encuentra un plan a tu medida.
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

      {/* Packages + payment toggle */}
      <PricingPackages pad={PAD} />

      {/* FAQ */}
      <FaqSection pad={PAD} />

      {/* Work with us */}
      <ContactSection pad={PAD} />

      {/* Footer */}
      <Footer pad={PAD} />
    </div>
  );
}
