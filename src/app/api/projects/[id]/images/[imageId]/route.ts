import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const image = db
      .select()
      .from(projectImages)
      .where(eq(projectImages.id, parseInt(imageId)))
      .get();

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const imagePath = path.join(process.cwd(), "public", image.src);
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.error(`Failed to delete image file: ${image.src}`, fileError);
    }

    // Delete from database
    db.delete(projectImages).where(eq(projectImages.id, parseInt(imageId))).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
