import { SignJWT, jwtVerify } from "jose";
import { findAccountByEmail } from "@/lib/account-store";

const COOKIE_NAME = "bab_auth";

function secretKey() {
  const secret = process.env.AUTH_SECRET || "dev-only-secret-change-me";
  return new TextEncoder().encode(secret);
}

const roleOrder = {
  crew: 1,
  lead: 2,
  hr: 3,
  manager: 4,
  owner: 5,
  master: 6,
};

export async function createSession(email) {
  const account = findAccountByEmail(email);
  const token = await new SignJWT({ email, role: account?.role || "manager" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSession() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { email: payload?.email || null, role: payload?.role || "manager" };
  } catch {
    return null;
  }
}

export function roleAtLeast(currentRole, requiredRole) {
  return (roleOrder[currentRole] || 0) >= (roleOrder[requiredRole] || 999);
}

export async function requireRole(requiredRole = "manager") {
  const session = await getSession();
  if (!session?.email) redirect("/login");
  const account = findAccountByEmail(session.email);
  if (!account || account.isActive === false) redirect("/login");
  if (!roleAtLeast(account.role || "crew", requiredRole)) redirect("/unauthorized");
  return { email: account.email, role: account.role };
}

export async function requireManagement() {
  return requireRole("manager");
}

export async function requireLeadAccess() {
  return requireRole("lead");
}


export function canViewJob(session, job) {
  if (!session?.email) return false;
  const role = session.role || "crew";
  if (roleAtLeast(role, "lead")) return true;
  const accountEmail = String(session.email || "").trim().toLowerCase();
  const assigned = Array.isArray(job?.crew) ? job.crew : [];
  const assignedEmails = Array.isArray(job?.crewEmails) ? job.crewEmails : [];
  return assignedEmails.map((x) => String(x).trim().toLowerCase()).includes(accountEmail)
    || assigned.map((x) => String(x).trim().toLowerCase()).includes(accountEmail);
}
