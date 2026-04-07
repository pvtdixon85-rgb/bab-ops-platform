import { deleteCrewMember } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

export async function DELETE(_req, { params }) {
  await requireRole("hr");
  deleteCrewMember(decodeURIComponent(params.name));
  return Response.json({ ok: true });
}
