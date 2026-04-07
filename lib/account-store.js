import fs from "fs";
import path from "path";
import crypto from "crypto";

const accountsPath = path.join(process.cwd(), "data", "accounts.json");

function ensureFile() {
  const dir = path.dirname(accountsPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(accountsPath)) fs.writeFileSync(accountsPath, "[]", "utf-8");
}

export function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password || "")).digest("hex");
}

export function readAccounts() {
  ensureFile();
  return JSON.parse(fs.readFileSync(accountsPath, "utf-8") || "[]");
}

export function writeAccounts(accounts) {
  ensureFile();
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2), "utf-8");
}

export function findAccountByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return readAccounts().find((a) => String(a.email || "").trim().toLowerCase() === normalized) || null;
}

export function verifyAccount(email, password) {
  const account = findAccountByEmail(email);
  if (!account || account.isActive === false) return null;
  const passwordHash = hashPassword(password);
  if (account.passwordHash !== passwordHash) return null;
  return account;
}

export function addAccount({ email, password, role = "manager" }) {
  const accounts = readAccounts();
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) throw new Error("Email required");
  if (!password) throw new Error("Password required");
  if (accounts.some((a) => String(a.email || "").trim().toLowerCase() === normalized)) {
    throw new Error("Account already exists");
  }
  const account = {
    email: normalized,
    passwordHash: hashPassword(password),
    role,
    isActive: true,
  };
  accounts.push(account);
  writeAccounts(accounts);
  return account;
}

export function removeAccount(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const accounts = readAccounts().filter((a) => String(a.email || "").trim().toLowerCase() !== normalized);
  writeAccounts(accounts);
  return true;
}

export function updateAccountRole(email, role) {
  const normalized = String(email || "").trim().toLowerCase();
  const accounts = readAccounts();
  const next = accounts.map((a) =>
    String(a.email || "").trim().toLowerCase() === normalized ? { ...a, role } : a
  );
  writeAccounts(next);
  return next.find((a) => String(a.email || "").trim().toLowerCase() === normalized) || null;
}
