import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";

const PAD = "clamp(20px, 6.25vw, 120px)";

export const metadata: Metadata = {
  title: "Vitalis — Eterno Studio™",
  description: "Branding, identidad visual, packaging y naming para Vitalis — suplementos de energía y bienestar.",
};

const project = {
  overview: [
    "Vitalis se centra en proporcionar a sus consumidores productos que son esenciales para mantener y mejorar la energía, la salud y el bienestar. Cada suplemento está formulado con ingredientes de alta calidad, respaldados por la ciencia, para apoyar una vida plena y activa.",
    "Para este proyecto desarrollamos un proceso integral de naming e identidad visual, creando una marca capaz de transmitir su esencia y proyectarse con claridad a largo plazo. Desde la elección del nombre hasta el desarrollo del sistema visual, cada decisión fue tomada estratégicamente para construir una identidad sólida, memorable y diferenciadora.",
  ],
  client: "Vitalis",
  location: "Lima, Perú",
  duration: "1 month",
  services: "Branding, Identidad Visual, Packaging, Naming.",
  images: [
    { src: "/images/vitalis-1.jpg", alt: "Vitalis poster display in a concrete gallery space" },
    { src: "/images/vitalis-2.jpg", alt: "Vitalis outdoor billboard display" },
  ],
};

export default function VitalisProject() {
  return (
    <div className="flex min-h-screen flex-col overflow-clip lg:h-screen lg:overflow-hidden">
      <Navbar pad={PAD} />

      <main
        className="animate-fade-up flex-1 overflow-hidden pt-[clamp(28px,5vh,60px)]"
        style={{ paddingInline: PAD, animationDelay: "0.5s" }}
      >
        <div className="grid gap-x-16 gap-y-12 lg:h-full lg:grid-cols-[1fr_minmax(0,1000px)]">
          {/* Info column */}
          <div className="flex flex-col gap-16">
            <div>
              <p className="text-[16px] tracking-[0.5px] text-[#666]">Overview</p>
              <div className="mt-4 flex max-w-[490px] flex-col gap-4 text-[16px] leading-[18px] tracking-[0.5px]">
                {project.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Cliente</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.client}</p>
              </div>
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Location:</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.location}</p>
              </div>
              <div>
                <p className="text-[16px] tracking-[0.5px] text-[#666]">Duration:</p>
                <p className="mt-4 text-[16px] tracking-[1px]">{project.duration}</p>
              </div>
            </div>

            <div>
              <p className="text-[16px] tracking-[0.5px] text-[#666]">Services:</p>
              <p className="mt-4 max-w-[150px] text-[16px] tracking-[1px]">{project.services}</p>
            </div>
          </div>

          {/* Gallery column */}
          <GallerySection images={project.images} />
        </div>
      </main>

      <footer
        className="animate-fade-up pb-[clamp(24px,5vh,56px)] pt-[clamp(28px,5vh,60px)] text-[12px]"
        style={{ paddingInline: PAD, animationDelay: "0.8s" }}
      >
        <p className="tracking-[0.42px]">
          ETERNO STUDIO©2026&nbsp;&nbsp;Creative Studio &amp; Strategic Design
        </p>
      </footer>
    </div>
  );
}
