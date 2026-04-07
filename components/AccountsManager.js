"use client";

import { useEffect, useState } from "react";

const roles = ["crew", "lead", "hr", "manager", "owner", "master"];

export default function AccountsManager() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role: "manager" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAccounts() {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function addAccount(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not add account");
      setForm({ email: "", password: "", role: "manager" });
      setMessage("Account added.");
      loadAccounts();
    } catch (err) {
      setMessage(err.message || "Could not add account");
    } finally {
      setLoading(false);
    }
  }

  async function removeAccount(email) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/accounts/${encodeURIComponent(email)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not remove account");
      setMessage("Account removed.");
      loadAccounts();
    } catch {
      setMessage("Could not remove account");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(email, role) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/accounts/${encodeURIComponent(email)}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not update role");
      setMessage("Role updated.");
      loadAccounts();
    } catch (err) {
      setMessage(err.message || "Could not update role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title">Account Management</div>
      <div className="section-sub">Create accounts and assign access levels for owner, hr, manager, lead, crew, or master.</div>

      <form className="form" style={{ maxWidth: "100%" }} onSubmit={addAccount}>
        <div className="grid-2">
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} />
        </div>
        <select className="input" value={form.role} onChange={(e) => update("role", e.target.value)}>
          {roles.map((role) => <option key={role}>{role}</option>)}
        </select>
        <div className="actions-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Account"}
          </button>
        </div>
      </form>

      <div className="list" style={{ marginTop: 18 }}>
        {accounts.map((a) => (
          <div key={a.email} className="list-item" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <strong>{a.email}</strong>
              <div className="muted" style={{ fontSize: 12 }}>Role: {a.role}</div>
            </div>
            <div className="actions-row">
              <select className="input" value={a.role} onChange={(e) => changeRole(a.email, e.target.value)} style={{ minWidth: 140 }}>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
              <button className="button secondary" type="button" onClick={() => removeAccount(a.email)} disabled={loading}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {message ? <div className="notice">{message}</div> : null}
    </div>
  );
}
