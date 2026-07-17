import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { order } = body;

    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: "Order array is required" },
        { status: 400 }
      );
    }

    // Update sort order for each project
    for (let i = 0; i < order.length; i++) {
      db.update(projects)
        .set({ sortOrder: i, updatedAt: new Date().toISOString() })
        .where(eq(projects.id, order[i]))
        .run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 }
    );
  }
}
