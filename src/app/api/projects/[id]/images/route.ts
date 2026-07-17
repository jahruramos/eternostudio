import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export async function POST(
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

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const alts = formData.getAll("alts") as string[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Ensure project directory exists
    const projectDir = path.join(process.cwd(), "public", "projects", project.slug);
    await fs.mkdir(projectDir, { recursive: true });

    // Get current max sort order
    const existingImages = db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id))
      .all();
    let nextOrder = existingImages.length > 0
      ? Math.max(...existingImages.map(img => img.sortOrder)) + 1
      : 0;

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const alt = alts[i] || "";

      // Generate filename
      const ext = path.extname(file.name) || ".jpg";
      const imageNum = String(existingImages.length + i + 1).padStart(2, "0");
      const filename = `${project.slug}-${imageNum}${ext}`;
      const filepath = path.join(projectDir, filename);

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filepath, buffer);

      // Save to database
      const src = `/projects/${project.slug}/${filename}`;
      const newImage = db
        .insert(projectImages)
        .values({
          projectId: project.id,
          src,
          alt,
          sortOrder: nextOrder++,
        })
        .returning()
        .get();

      uploadedImages.push(newImage);
    }

    return NextResponse.json(uploadedImages, { status: 201 });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const images = db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, parseInt(id)))
      .orderBy(asc(projectImages.sortOrder))
      .all();

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // ensure params are resolved
    const body = await request.json();
    const { imageId, alt } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const updatedImage = db
      .update(projectImages)
      .set({ alt })
      .where(eq(projectImages.id, imageId))
      .returning()
      .get();

    if (!updatedImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
