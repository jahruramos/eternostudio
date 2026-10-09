import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export interface WorkItem {
  src: string;
  alt: string;
  href: string;
}

export async function getPublishedWork(limit?: number): Promise<WorkItem[]> {
  const query = db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder));

  const publishedProjects = limit ? await query.limit(limit) : await query;

  return publishedProjects.map((project) => ({
    src: project.thumbnail || "/images/thumb-vitalis.png",
    alt: `${project.title} branding`,
    href: `/work/${project.slug}`,
  }));
}
