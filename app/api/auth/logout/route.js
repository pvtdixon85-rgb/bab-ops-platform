import { clearSession } from "@/lib/auth-session";

export async function POST() {
  clearSession();
  return Response.json({ ok: true });
}
