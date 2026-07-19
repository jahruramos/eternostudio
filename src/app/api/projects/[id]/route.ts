import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

const VALID_STATUSES = ["draft", "published"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_FIELD_LENGTHS = {
  title: 200,
  slug: 100,
  client: 200,
  location: 200,
  duration: 100,
  services: 500,
  overview: 10000,
  thumbnail: 500,
};

function isSafePath(src: string): boolean {
  if (src.startsWith("/projects/") || src.startsWith("/images/")) {
    const normalized = path.normalize(src);
    return normalized === src && !normalized.includes("..");
  }
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)));
    const project = rows[0];

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id));

    return NextResponse.json({ ...project, images });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, client, location, duration, services, overview, thumbnail, status } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be draft or published" },
        { status: 400 }
      );
    }

    if (slug && !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Use lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    const existingRows = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)));
    const existingProject = existingRows[0];

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof projects.$inferInsert> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (typeof title === "string") updateData.title = title.trim().slice(0, MAX_FIELD_LENGTHS.title);
    if (typeof slug === "string") updateData.slug = slug.trim().slice(0, MAX_FIELD_LENGTHS.slug);
    if (typeof client === "string") updateData.client = client.trim().slice(0, MAX_FIELD_LENGTHS.client) || null;
    if (typeof location === "string") updateData.location = location.trim().slice(0, MAX_FIELD_LENGTHS.location) || null;
    if (typeof duration === "string") updateData.duration = duration.trim().slice(0, MAX_FIELD_LENGTHS.duration) || null;
    if (typeof services === "string") updateData.services = services.trim().slice(0, MAX_FIELD_LENGTHS.services) || null;
    if (typeof overview === "string") updateData.overview = overview.trim().slice(0, MAX_FIELD_LENGTHS.overview) || null;
    if (typeof thumbnail === "string") updateData.thumbnail = thumbnail.trim().slice(0, MAX_FIELD_LENGTHS.thumbnail) || null;

    const updatedRows = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)));
    const project = rows[0];

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!SLUG_REGEX.test(project.slug)) {
      return NextResponse.json(
        { error: "Invalid project slug" },
        { status: 400 }
      );
    }

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id));

    for (const image of images) {
      if (!isSafePath(image.src)) continue;
      try {
        const imagePath = path.join(process.cwd(), "public", image.src);
        await fs.unlink(imagePath);
      } catch (fileError) {
        console.error(`Failed to delete image file: ${image.src}`, fileError);
      }
    }

    const projectDir = path.join(process.cwd(), "public", "projects", project.slug);
    const normalizedDir = path.normalize(projectDir);
    const publicDir = path.join(process.cwd(), "public");
    if (!normalizedDir.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Invalid project path" },
        { status: 400 }
      );
    }

    try {
      await fs.rm(projectDir, { recursive: true, force: true });
    } catch (dirError) {
      console.error(`Failed to delete project directory: ${project.slug}`, dirError);
    }

    await db.delete(projects).where(eq(projects.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
