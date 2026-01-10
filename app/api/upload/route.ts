import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/storage/local";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const eventId = formData.get("eventId") as string;

  if (!file || !eventId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = await saveFile(buffer, file.name);

  const document = await prisma.document.create({
    data: {
      fileName: filePath.split("/").pop()!,
      originalFileName: file.name,
      cloud_storage_path: filePath,
      isPublic: true,
      mimeType: file.type,
      fileSize: file.size,
      eventId,
      uploadedById: "SYSTEM", // ou session.user.id
    },
  });

  return NextResponse.json(document);
}
