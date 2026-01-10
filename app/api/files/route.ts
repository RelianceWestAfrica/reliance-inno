import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/storage/local";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteFile(doc.cloud_storage_path);
  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
