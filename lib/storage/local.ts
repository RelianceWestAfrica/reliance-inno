import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveFile(buffer: Buffer, filename: string) {
  ensureUploadDir();
  const uniqueName = `${Date.now()}-${filename}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${uniqueName}`;
}

export async function deleteFile(filePath: string) {
  const absolutePath = path.join(process.cwd(), "public", filePath);
  if (fs.existsSync(absolutePath)) {
    await fs.promises.unlink(absolutePath);
  }
}
