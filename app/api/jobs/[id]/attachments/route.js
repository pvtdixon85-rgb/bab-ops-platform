import fs from "fs";
import path from "path";
import { addAttachmentToJob, removeAttachmentFromJobByStoredName } from "@/lib/data-store";

function safeName(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");
}

export async function POST(req, { params }) {
  const formData = await req.formData();
  const file = formData.get("file");
  const type = String(formData.get("type") || "Attachment");

  if (!file || typeof file === "string") {
    return Response.json({ ok: false, error: "No file uploaded" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads", params.id);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const originalName = safeName(file.name);
  const finalName = `${Date.now()}_${originalName}`;
  const fullPath = path.join(uploadsDir, finalName);
  fs.writeFileSync(fullPath, bytes);

  const attachment = {
    type,
    name: originalName,
    storedName: finalName,
    url: `/uploads/${params.id}/${finalName}`,
  };

  const job = addAttachmentToJob(params.id, attachment);
  return Response.json({ ok: true, job, attachment });
}

export async function DELETE(req, { params }) {
  const body = await req.json();
  const storedName = String(body.storedName || "");
  if (!storedName) {
    return Response.json({ ok: false, error: "storedName required" }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), "public", "uploads", params.id, storedName);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

  const job = removeAttachmentFromJobByStoredName(params.id, storedName);
  return Response.json({ ok: true, job });
}
