import { readJobs, writeJobs, readCrew } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

export async function POST(req, { params }) {
  await requireRole("lead");
  const body = await req.json();
  const jobs = readJobs();
  const jobIndex = jobs.findIndex((j) => j.id === params.id);
  if (jobIndex === -1) {
    return new Response("Job not found", { status: 404 });
  }

  const crew = Array.isArray(body.crew) ? body.crew : [];
  const crewDirectory = readCrew();
  const crewEmails = crew
    .map((name) => {
      const match = crewDirectory.find((m) => String(m.name || "").trim() === String(name || "").trim());
      return match?.email || "";
    })
    .filter(Boolean);

  jobs[jobIndex] = { ...jobs[jobIndex], crew, crewEmails };
  writeJobs(jobs);

  return Response.json({ ok: true, crew, crewEmails });
}
