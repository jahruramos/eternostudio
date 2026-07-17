import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const images = db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id))
      .all();

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

    const existingProject = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const updatedProject = db
      .update(projects)
      .set({
        title,
        slug,
        client,
        location,
        duration,
        services,
        overview: overview || null,
        thumbnail,
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, parseInt(id)))
      .returning()
      .get();

    return NextResponse.json(updatedProject);
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
    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get all images for this project
    const images = db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id))
      .all();

    // Delete image files from disk
    for (const image of images) {
      try {
        const imagePath = path.join(process.cwd(), "public", image.src);
        await fs.unlink(imagePath);
      } catch (fileError) {
        console.error(`Failed to delete image file: ${image.src}`, fileError);
      }
    }

    // Delete project directory if it exists
    try {
      const projectDir = path.join(process.cwd(), "public", "projects", project.slug);
      await fs.rm(projectDir, { recursive: true, force: true });
    } catch (dirError) {
      console.error(`Failed to delete project directory: ${project.slug}`, dirError);
    }

    // Delete from database (cascade will handle images)
    db.delete(projects).where(eq(projects.id, parseInt(id))).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
