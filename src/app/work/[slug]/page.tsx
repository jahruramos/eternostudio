import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import ProjectView from "@/components/ProjectView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  noStore();
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug));
  const project = rows[0];

  if (!project) {
    return { title: "Proyecto no encontrado — Eterno Studio™" };
  }

  return {
    title: `${project.title} — Eterno Studio™`,
    description: project.services || `${project.title} project by Eterno Studio`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  noStore();
  const { slug } = await params;
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug));
  const project = rows[0];

  if (!project) {
    notFound();
  }

  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, project.id))
    .orderBy(asc(projectImages.sortOrder));

  const projectData = {
    overview: project.overview || "",
    client: project.client || "",
    location: project.location || "",
    duration: project.duration || "",
    services: project.services || "",
    images: images.map((img) => ({ src: img.src, alt: img.alt || "" })),
  };

  return <ProjectView project={projectData} />;
}
