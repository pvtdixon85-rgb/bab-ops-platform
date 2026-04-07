import { requireRole } from "@/lib/auth-session";
import { removeAccount } from "@/lib/account-store";

export async function DELETE(_req, { params }) {
  await requireRole("owner");
  removeAccount(decodeURIComponent(params.email));
  return Response.json({ ok: true });
}
