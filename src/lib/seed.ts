import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { projects, projectImages } from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

async function seed() {
  console.log("Seeding database...");

  // Insert Vitalis project
  const vitalisProject = db
    .insert(projects)
    .values({
      slug: "vitalis",
      title: "Vitalis",
      client: "Vitalis",
      location: "Lima, Perú",
      duration: "1 month",
      services: "Branding, Identidad Visual, Packaging, Naming.",
      overview: "Vitalis se centra en proporcionar a sus consumidores productos que son esenciales para mantener y mejorar la energía, la salud y el bienestar. Cada suplemento está formulado con ingredientes de alta calidad, respaldados por la ciencia, para apoyar una vida plena y activa. Para este proyecto desarrollamos un proceso integral de naming e identidad visual, creando una marca capaz de transmitir su esencia y proyectarse con claridad a largo plazo. Desde la elección del nombre hasta el desarrollo del sistema visual, cada decisión fue tomada estratégicamente para construir una identidad sólida, memorable y diferenciadora.",
      thumbnail: "/images/thumb-vitalis.png",
      status: "published",
      sortOrder: 0,
    })
    .returning()
    .get();

  console.log("Created Vitalis project:", vitalisProject.id);

  // Insert Vitalis images
  const vitalisImages = [
    { src: "/projects/vitalis/vitalis-01.jpg", alt: "Vitalis brand color palette and Pantone specifications" },
    { src: "/projects/vitalis/vitalis-02.jpg", alt: "Vitalis wordmark with margins and safe area guidelines" },
    { src: "/projects/vitalis/vitalis-03.jpg", alt: "Vitalis business card and Shilajit Gummies packaging" },
    { src: "/projects/vitalis/vitalis-04.jpg", alt: "Vitalis Instagram story ads and logo construction grid" },
    { src: "/projects/vitalis/vitalis-05.jpg", alt: "Vitalis print poster series and lifestyle photography" },
    { src: "/projects/vitalis/vitalis-06.jpg", alt: "Vitalis brand application and visual identity system" },
    { src: "/projects/vitalis/vitalis-07.jpg", alt: "Vitalis product packaging and brand collateral" },
  ];

  for (let i = 0; i < vitalisImages.length; i++) {
    db.insert(projectImages)
      .values({
        projectId: vitalisProject.id,
        src: vitalisImages[i].src,
        alt: vitalisImages[i].alt,
        sortOrder: i,
      })
      .run();
  }

  console.log(`Created ${vitalisImages.length} images for Vitalis`);
  console.log("Seed complete!");
}

seed().catch(console.error);
