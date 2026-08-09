import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const rows = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.id, parseInt(imageId)));
    const image = rows[0];

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    if (image.src.startsWith("http")) {
      try {
        await del(image.src);
      } catch (fileError) {
        console.error(`Failed to delete blob: ${image.src}`, fileError);
      }
    }

    await db.delete(projectImages).where(eq(projectImages.id, parseInt(imageId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
