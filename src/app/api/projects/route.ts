import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let allProjects;
    if (status) {
      allProjects = db
        .select()
        .from(projects)
        .where(eq(projects.status, status))
        .orderBy(asc(projects.sortOrder))
        .all();
    } else {
      allProjects = db
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder))
        .all();
    }

    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, client, location, duration, services, overview, thumbnail, status } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Get max sort order
    const maxOrder = db
      .select({ maxOrder: projects.sortOrder })
      .from(projects)
      .all();
    const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(p => p.maxOrder)) + 1 : 0;

    const newProject = db
      .insert(projects)
      .values({
        title,
        slug,
        client,
        location,
        duration,
        services,
        overview: overview || null,
        thumbnail,
        status: status || "draft",
        sortOrder: nextOrder,
      })
      .returning()
      .get();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
