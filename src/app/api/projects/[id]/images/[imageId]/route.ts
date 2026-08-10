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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const body = await request.json();
    const { alt } = body;

    const sanitizedAlt = typeof alt === "string" ? alt.trim().slice(0, 500) : "";

    const updatedRows = await db
      .update(projectImages)
      .set({ alt: sanitizedAlt })
      .where(eq(projectImages.id, parseInt(imageId)))
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
