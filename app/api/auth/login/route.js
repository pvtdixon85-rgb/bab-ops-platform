import { createSession } from "@/lib/auth-session";
import { verifyAccount } from "@/lib/account-store";

export async function POST(req) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return Response.json({ ok: false, error: "Email and password required" }, { status: 400 });
  }

  const account = verifyAccount(email, password);
  if (!account) {
    return Response.json({ ok: false, error: "Access denied" }, { status: 403 });
  }

  await createSession(account.email);
  return Response.json({ ok: true });
}
