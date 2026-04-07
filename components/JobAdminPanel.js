"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "New Lead",
  "Reviewing",
  "Approved",
  "Scheduled",
  "In Progress",
  "Completed",
  "Archived",
];

export default function JobAdminPanel({ job }) {
  const router = useRouter();
  const [form, setForm] = useState({
    client: job.client || "",
    show: job.show || "",
    location: job.location || "",
    venue: job.venue || "",
    boothNumber: job.boothNumber || "",
    booth: job.booth || "",
    labor: job.labor || "",
    start: job.start || "",
    installTime: job.installTime || "",
    end: job.end || "",
    dismantleTime: job.dismantleTime || "",
    status: job.status || "New Lead",
    cityLead: job.cityLead || "",
    exhibitorContact: job.exhibitorContact || "",
    exhibitorEmail: job.exhibitorEmail || "",
    billTo: job.billTo || "",
    notes: job.notes || "",
    specialInstructions: job.specialInstructions || "",
  });
  const [crewText, setCrewText] = useState(job.crew?.join("\n") || "");
  const [attachmentsText, setAttachmentsText] = useState(
    (job.attachments || []).map((a) => `${a.type}: ${a.name}`).join("\n")
  );
  const [crewDirectory, setCrewDirectory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/crew")
      .then((res) => res.json())
      .then((data) => setCrewDirectory(Array.isArray(data) ? data : []))
      .catch(() => setCrewDirectory([]));
  }, []);

  const crewNames = useMemo(() => crewDirectory.map((item) => item.name), [crewDirectory]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addCrewName(name) {
    if (!name) return;
    const lines = crewText.split("\n").map((x) => x.trim()).filter(Boolean);
    if (!lines.includes(name)) setCrewText([...lines, name].join("\n"));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const crew = crewText.split("\n").map((item) => item.trim()).filter(Boolean);
      const attachments = attachmentsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(":");
          if (parts.length >= 2) return { type: parts[0].trim(), name: parts.slice(1).join(":").trim() };
          return { type: "Attachment", name: line };
        });

      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, crew, attachments }),
      });

      if (!res.ok) throw new Error("save failed");
      setMessage("Job updated.");
      router.refresh();
    } catch {
      setMessage("Could not save updates.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(`Delete ${job.id}? This cannot be undone.`);
    if (!confirmDelete) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      router.push("/jobs");
      router.refresh();
    } catch {
      setMessage("Could not delete job.");
      setSaving(false);
    }
  }

  async function handleDuplicate() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/jobs/${job.id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("duplicate failed");
      const data = await res.json();
      router.push(`/jobs/${data.job.id}`);
      router.refresh();
    } catch {
      setMessage("Could not duplicate job.");
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title">Management Controls</div>
      <div className="section-sub">Edit core job fields, staffing, attachment list, or duplicate/delete from one place.</div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Core Job Fields</div>
          <div className="form" style={{ maxWidth: "100%" }}>
            <input className="input" value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="Client" />
            <input className="input" value={form.show} onChange={(e) => update("show", e.target.value)} placeholder="Show" />
            <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" />
            <input className="input" value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Venue" />
            <input className="input" value={form.boothNumber} onChange={(e) => update("boothNumber", e.target.value)} placeholder="Booth Number" />
            <input className="input" value={form.booth} onChange={(e) => update("booth", e.target.value)} placeholder="Booth Size" />
            <input className="input" value={form.labor} onChange={(e) => update("labor", e.target.value)} placeholder="Labor Needed" />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Schedule & Contacts</div>
          <div className="form" style={{ maxWidth: "100%" }}>
            <input className="input" type="date" value={form.start} onChange={(e) => update("start", e.target.value)} />
            <input className="input" type="time" value={form.installTime} onChange={(e) => update("installTime", e.target.value)} />
            <input className="input" type="date" value={form.end} onChange={(e) => update("end", e.target.value)} />
            <input className="input" type="time" value={form.dismantleTime} onChange={(e) => update("dismantleTime", e.target.value)} />
            <input className="input" value={form.exhibitorContact} onChange={(e) => update("exhibitorContact", e.target.value)} placeholder="Exhibitor Contact" />
            <input className="input" value={form.exhibitorEmail} onChange={(e) => update("exhibitorEmail", e.target.value)} placeholder="Exhibitor Email" />
            <input className="input" value={form.billTo} onChange={(e) => update("billTo", e.target.value)} placeholder="Bill To" />
          </div>
        </div>
      </div>

      <div style={{ height: 18 }} />

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Workflow & Crew</div>
          <div className="form" style={{ maxWidth: "100%" }}>
            <select className="input" value={form.status} onChange={(e) => update("status", e.target.value)}>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input className="input" value={form.cityLead} onChange={(e) => update("cityLead", e.target.value)} placeholder="City Lead" />

            <div>
              <div style={{ marginBottom: 8 }}>Crew Directory</div>
              <div className="actions-row">
                {crewNames.map((name) => (
                  <button key={name} type="button" className="button secondary" onClick={() => addCrewName(name)}>
                    + {name}
                  </button>
                ))}
              </div>
            </div>

            <textarea className="textarea" rows="5" value={crewText} onChange={(e) => setCrewText(e.target.value)} placeholder={"Marcus Reed\nAndre Lewis\nTroy Bennett"} />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Notes & Attachments</div>
          <div className="form" style={{ maxWidth: "100%" }}>
            <textarea className="textarea" rows="4" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Internal Notes" />
            <textarea className="textarea" rows="4" value={form.specialInstructions} onChange={(e) => update("specialInstructions", e.target.value)} placeholder="Special Instructions" />
            <textarea className="textarea" rows="5" value={attachmentsText} onChange={(e) => setAttachmentsText(e.target.value)} placeholder={"Rendering: booth_rendering.pdf\nFloor Plan: floor_plan.pdf\nGraphics: graphics_package.zip"} />
            <div className="muted" style={{ fontSize: 12 }}>
              You can still type attachment entries here, but this version also supports real file uploads above.
            </div>
          </div>
        </div>
      </div>

      <div className="actions-row" style={{ marginTop: 18 }}>
        <button className="button" type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Working..." : "Save Updates"}
        </button>
        <button className="button secondary" type="button" onClick={handleDuplicate} disabled={saving}>
          Duplicate Job
        </button>
        <button className="button secondary" type="button" onClick={handleDelete} disabled={saving}>
          Delete Job
        </button>
      </div>

      {message ? <div className="notice">{message}</div> : null}
    </div>
  );
}
