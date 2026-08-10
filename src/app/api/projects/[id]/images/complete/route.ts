import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url, alt } = body;

    if (typeof url !== "string" || !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Valid blob URL is required" },
        { status: 400 }
      );
    }

    const projectRows = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)));
    const project = projectRows[0];

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const existingImages = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id));
    const nextOrder = existingImages.length > 0
      ? Math.max(...existingImages.map(img => img.sortOrder)) + 1
      : 0;

    const sanitizedAlt = typeof alt === "string" ? alt.trim().slice(0, 500) : "";

    const newImage = await db
      .insert(projectImages)
      .values({
        projectId: project.id,
        src: url,
        alt: sanitizedAlt,
        sortOrder: nextOrder,
      })
      .returning();

    return NextResponse.json(newImage[0], { status: 201 });
  } catch (error) {
    console.error("Error saving uploaded image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
