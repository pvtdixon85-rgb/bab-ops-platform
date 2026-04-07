import fs from "fs";
import path from "path";
import { readJobs, writeJobs } from "@/lib/data-store";

function safeName(value) {
  return String(value || "").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
}

export async function POST(req, { params }) {
  const formData = await req.formData();
  const file = formData.get("file");
  const storedName = String(formData.get("storedName") || "");
  const type = String(formData.get("type") || "Attachment");

  if (!file || typeof file === "string" || !storedName) {
    return Response.json({ ok: false, error: "file and storedName required" }, { status: 400 });
  }

  const jobs = readJobs();
  const idx = jobs.findIndex((j) => j.id === params.id);
  if (idx === -1) return Response.json({ ok: false, error: "job not found" }, { status: 404 });

  const uploadsDir = path.join(process.cwd(), "public", "uploads", params.id);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const oldAttachment = (jobs[idx].attachments || []).find((a) => a.storedName === storedName);
  if (!oldAttachment) return Response.json({ ok: false, error: "attachment not found" }, { status: 404 });

  const oldPath = path.join(uploadsDir, storedName);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

  const originalName = safeName(file.name);
  const finalName = `${Date.now()}_${originalName}`;
  const fullPath = path.join(uploadsDir, finalName);
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(fullPath, bytes);

  jobs[idx].attachments = (jobs[idx].attachments || []).map((a) =>
    a.storedName === storedName
      ? { ...a, type, name: originalName, storedName: finalName, url: `/uploads/${params.id}/${finalName}` }
      : a
  );

  writeJobs(jobs);
  return Response.json({ ok: true, job: jobs[idx] });
}
