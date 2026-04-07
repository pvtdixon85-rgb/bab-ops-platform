import { requireRole } from "@/lib/auth-session";
import { updateAccountRole } from "@/lib/account-store";

export async function POST(req, { params }) {
  const session = await requireRole("owner");
  const body = await req.json();
  const email = decodeURIComponent(params.email);
  const role = String(body.role || "manager");

  const blocked = String(session.email || "").trim().toLowerCase() === String(email).trim().toLowerCase() && role !== "master" && role !== "owner";
  if (blocked) {
    return Response.json({ ok: false, error: "You cannot downgrade your own owner/master account here." }, { status: 400 });
  }

  const updated = updateAccountRole(email, role);
  return Response.json({ ok: true, account: updated });
}
