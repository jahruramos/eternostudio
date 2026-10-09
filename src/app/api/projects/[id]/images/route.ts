import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectImages } from "@/lib/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 60 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_TYPES,
        maximumSizeInBytes: MAX_FILE_SIZE,
        addRandomSuffix: false,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error generating upload token:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to start upload" },
      { status: 400 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    const imageIds = ids
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value));

    if (imageIds.length === 0) {
      return NextResponse.json(
        { error: "No valid image ids provided" },
        { status: 400 }
      );
    }

    const images = await db
      .select()
      .from(projectImages)
      .where(
        and(
          eq(projectImages.projectId, projectId),
          inArray(projectImages.id, imageIds)
        )
      );

    for (const image of images) {
      if (!image.src.startsWith("http")) continue;
      try {
        await del(image.src);
      } catch (fileError) {
        console.error(`Failed to delete blob: ${image.src}`, fileError);
      }
    }

    await db
      .delete(projectImages)
      .where(
        and(
          eq(projectImages.projectId, projectId),
          inArray(projectImages.id, imageIds)
        )
      );

    return NextResponse.json({ deleted: images.length });
  } catch (error) {
    console.error("Error deleting images:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
