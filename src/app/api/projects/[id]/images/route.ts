import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
