import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "thumbnails");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `thumb-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ url: `/images/thumbnails/${filename}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
