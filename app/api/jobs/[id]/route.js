import { readJobs, updateJob, deleteJob } from "@/lib/data-store";

export async function GET(_req, { params }) {
  const jobs = readJobs();
  const job = jobs.find((item) => item.id === params.id);
  return Response.json(job || null);
}

export async function PATCH(req, { params }) {
  const body = await req.json();
  const updated = updateJob(params.id, body);
  return Response.json({ ok: true, job: updated });
}

export async function DELETE(_req, { params }) {
  deleteJob(params.id);
  return Response.json({ ok: true });
}
