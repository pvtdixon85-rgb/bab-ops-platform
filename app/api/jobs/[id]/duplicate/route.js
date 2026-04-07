import { duplicateJob } from "@/lib/data-store";

export async function POST(_req, { params }) {
  const job = duplicateJob(params.id);
  return Response.json({ ok: true, job });
}
