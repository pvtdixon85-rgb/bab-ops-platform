import { deleteCrewMember } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

export async function DELETE(req, { params }) {
  requireRole("hr"); // 🔥 real protection

  const name = decodeURIComponent(params.name);

  deleteCrewMember(name);

  return Response.json({ ok: true });
}