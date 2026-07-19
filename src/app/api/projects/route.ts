import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import type { NewProject } from "@/lib/schema";

const VALID_STATUSES = ["draft", "published"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_FIELD_LENGTHS = {
  title: 200,
  slug: 100,
  client: 200,
  location: 200,
  duration: 100,
  services: 500,
  overview: 10000,
  thumbnail: 500,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let allProjects;
    if (status) {
      allProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.status, status))
        .orderBy(asc(projects.sortOrder));
    } else {
      allProjects = await db
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder));
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

    if (!SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Use lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    const projectStatus = status || "draft";
    if (!VALID_STATUSES.includes(projectStatus)) {
      return NextResponse.json(
        { error: "Invalid status. Must be draft or published" },
        { status: 400 }
      );
    }

    const maxOrder = await db
      .select({ maxOrder: projects.sortOrder })
      .from(projects);
    const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(p => p.maxOrder)) + 1 : 0;

    const insertData: NewProject = {
      title: title.trim().slice(0, MAX_FIELD_LENGTHS.title),
      slug: slug.trim().slice(0, MAX_FIELD_LENGTHS.slug),
      status: projectStatus,
      sortOrder: nextOrder,
      client: typeof client === "string" ? client.trim().slice(0, MAX_FIELD_LENGTHS.client) || null : null,
      location: typeof location === "string" ? location.trim().slice(0, MAX_FIELD_LENGTHS.location) || null : null,
      duration: typeof duration === "string" ? duration.trim().slice(0, MAX_FIELD_LENGTHS.duration) || null : null,
      services: typeof services === "string" ? services.trim().slice(0, MAX_FIELD_LENGTHS.services) || null : null,
      overview: typeof overview === "string" ? overview.trim().slice(0, MAX_FIELD_LENGTHS.overview) || null : null,
      thumbnail: typeof thumbnail === "string" ? thumbnail.trim().slice(0, MAX_FIELD_LENGTHS.thumbnail) || null : null,
    };

    const newProject = await db
      .insert(projects)
      .values(insertData)
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
