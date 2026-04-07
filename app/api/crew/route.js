import { readCrew, addCrewMember } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

export async function GET() {
  await requireRole("lead");
  return Response.json(readCrew());
}

export async function POST(req) {
  await requireRole("hr");
  const body = await req.json();
  const member = {
    name: body.name || "",
    role: body.role || "Installer",
    region: body.region || "",
    phone: body.phone || "",
    email: body.email || "",
  };
  addCrewMember(member);
  return Response.json({ ok: true, member });
}
