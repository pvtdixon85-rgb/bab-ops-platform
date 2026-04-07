import { requireRole } from "@/lib/auth-session";
import { readAccounts, addAccount } from "@/lib/account-store";

export async function GET() {
  await requireRole("owner");
  const accounts = readAccounts().map((a) => ({
    email: a.email,
    role: a.role,
    isActive: a.isActive !== false,
  }));
  return Response.json(accounts);
}

export async function POST(req) {
  await requireRole("owner");
  const body = await req.json();
  const account = addAccount({
    email: body.email,
    password: body.password,
    role: body.role || "manager",
  });
  return Response.json({
    ok: true,
    account: { email: account.email, role: account.role, isActive: account.isActive },
  });
}
