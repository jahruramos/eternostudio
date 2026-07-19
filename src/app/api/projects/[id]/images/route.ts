import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (!isSafeSlug(project.slug)) {
      return NextResponse.json(
        { error: "Invalid project slug" },
        { status: 400 }
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

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Allowed: JPG, PNG, WebP, SVG` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max 10MB` },
          { status: 400 }
        );
      }
    }

    const projectDir = path.join(process.cwd(), "public", "projects", project.slug);
    await fs.mkdir(projectDir, { recursive: true });

    const existingImages = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id));
    let nextOrder = existingImages.length > 0
      ? Math.max(...existingImages.map(img => img.sortOrder)) + 1
      : 0;

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const alt = alts[i] || "";

      const ext = path.extname(file.name) || ".jpg";
      const imageNum = String(existingImages.length + i + 1).padStart(2, "0");
      const filename = `${project.slug}-${imageNum}${ext}`;
      const filepath = path.join(projectDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filepath, buffer);

      const src = `/projects/${project.slug}/${filename}`;
      const newImage = await db
        .insert(projectImages)
        .values({
          projectId: project.id,
          src,
          alt,
          sortOrder: nextOrder++,
        })
        .returning();

      uploadedImages.push(newImage[0]);
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
    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, parseInt(id)))
      .orderBy(asc(projectImages.sortOrder));

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
    await params;
    const body = await request.json();
    const { imageId, alt } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const sanitizedAlt = typeof alt === "string" ? alt.trim().slice(0, 500) : "";

    const updatedRows = await db
      .update(projectImages)
      .set({ alt: sanitizedAlt })
      .where(eq(projectImages.id, imageId))
      .returning();

    if (!updatedRows[0]) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
