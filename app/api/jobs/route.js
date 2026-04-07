import { readJobs, writeJobs, nextJobNumber } from "@/lib/data-store";

export async function GET() {
  return Response.json(readJobs());
}

export async function POST(req) {
  const body = await req.json();
  const jobs = readJobs();

  const newJob = {
    id: nextJobNumber(),
    client: body.client || "",
    show: body.show || "",
    location: body.location || "",
    start: body.start || "",
    end: body.end || "",
    booth: body.booth || "",
    labor: body.labor || "",
    status: body.status || "New Lead",
    notes: body.notes || "",
    projectManager: body.projectManager || "Aaron Dixon",
    accountManager: body.accountManager || "BAB Management",
    exhibitorContact: body.exhibitorContact || "",
    exhibitorEmail: body.exhibitorEmail || "",
    boothNumber: body.boothNumber || "",
    venue: body.venue || "",
    cityLead: body.cityLead || "TBD",
    installTime: body.installTime || "",
    dismantleTime: body.dismantleTime || "",
    specialInstructions: body.specialInstructions || "",
    billTo: body.billTo || body.client || ""
  };

  jobs.unshift(newJob);
  writeJobs(jobs);
  return Response.json({ ok: true, job: newJob });
}
