import type { Metadata } from "next";
import VitalisView from "@/components/VitalisView";

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
    { src: "/projects/vitalis/vitalis-01.jpg", alt: "Vitalis brand color palette and Pantone specifications" },
    { src: "/projects/vitalis/vitalis-02.jpg", alt: "Vitalis wordmark with margins and safe area guidelines" },
    { src: "/projects/vitalis/vitalis-03.jpg", alt: "Vitalis business card and Shilajit Gummies packaging" },
    { src: "/projects/vitalis/vitalis-04.jpg", alt: "Vitalis Instagram story ads and logo construction grid" },
    { src: "/projects/vitalis/vitalis-05.jpg", alt: "Vitalis print poster series and lifestyle photography" },
    { src: "/projects/vitalis/vitalis-06.jpg", alt: "Vitalis brand application and visual identity system" },
    { src: "/projects/vitalis/vitalis-07.jpg", alt: "Vitalis product packaging and brand collateral" },
  ],
};

export default function VitalisProject() {
  return <VitalisView project={project} />;
}
