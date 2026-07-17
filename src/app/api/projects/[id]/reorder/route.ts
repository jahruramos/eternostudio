import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectImages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // ensure params are resolved
    const body = await request.json();
    const { order } = body;

    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: "Order array is required" },
        { status: 400 }
      );
    }

    // Update sort order for each image
    for (let i = 0; i < order.length; i++) {
      db.update(projectImages)
        .set({ sortOrder: i })
        .where(eq(projectImages.id, order[i]))
        .run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering images:", error);
    return NextResponse.json(
      { error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}
