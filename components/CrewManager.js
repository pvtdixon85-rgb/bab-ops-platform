"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrewManager() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", role: "Installer", region: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("add failed");
      setForm({ name: "", role: "Installer", region: "", phone: "", email: "" });
      setMessage("Crew member added.");
      router.refresh();
    } catch {
      setMessage("Could not add crew member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title">Add Crew Member</div>
      <div className="section-sub">Add new BAB crew to the assignment directory.</div>

      <form className="form" style={{ maxWidth: "100%" }} onSubmit={handleAdd}>
        <div className="grid-2">
          <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input className="input" placeholder="Region" value={form.region} onChange={(e) => update("region", e.target.value)} />
        </div>

        <div className="grid-2">
          <select className="input" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option>Installer</option>
            <option>Lead Installer</option>
            <option>Supervisor</option>
            <option>Electrician</option>
            <option>Carpenter</option>
          </select>
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <input className="input" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />

        <div className="actions-row">
          <button className="button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Crew Member"}
          </button>
        </div>

        {message ? <div className="notice">{message}</div> : null}
      </form>
    </div>
  );
}
