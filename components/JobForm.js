"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  client: "",
  show: "",
  location: "",
  start: "",
  end: "",
  booth: "",
  labor: "",
  status: "New Lead",
  notes: "",
  exhibitorContact: "",
  exhibitorEmail: "",
  boothNumber: "",
  venue: "",
  cityLead: "",
  specialInstructions: "",
  billTo: "",
  installTime: "",
  dismantleTime: ""
};

export default function JobForm() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to create job");
      const data = await res.json();
      router.push(`/jobs/${data.job.id}`);
      router.refresh();
    } catch (err) {
      setError("Could not save the job right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" style={{ maxWidth: "100%" }} onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="card">
          <div className="section-title">Client & Show</div>
          <div className="form">
            <input className="input" placeholder="Client / Company" value={form.client} onChange={(e) => update("client", e.target.value)} />
            <input className="input" placeholder="Show Name" value={form.show} onChange={(e) => update("show", e.target.value)} />
            <input className="input" placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
            <input className="input" placeholder="Venue" value={form.venue} onChange={(e) => update("venue", e.target.value)} />
            <input className="input" placeholder="Booth Number" value={form.boothNumber} onChange={(e) => update("boothNumber", e.target.value)} />
            <input className="input" placeholder="Booth Size" value={form.booth} onChange={(e) => update("booth", e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Dates & Labor</div>
          <div className="form">
            <input className="input" type="date" value={form.start} onChange={(e) => update("start", e.target.value)} />
            <input className="input" type="time" value={form.installTime} onChange={(e) => update("installTime", e.target.value)} />
            <input className="input" type="date" value={form.end} onChange={(e) => update("end", e.target.value)} />
            <input className="input" type="time" value={form.dismantleTime} onChange={(e) => update("dismantleTime", e.target.value)} />
            <input className="input" placeholder="Labor Needed" value={form.labor} onChange={(e) => update("labor", e.target.value)} />
            <input className="input" placeholder="City Lead" value={form.cityLead} onChange={(e) => update("cityLead", e.target.value)} />
            <select className="input" value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option>New Lead</option>
              <option>Reviewing</option>
              <option>Approved</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ height: 18 }} />

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Contacts</div>
          <div className="form">
            <input className="input" placeholder="Exhibitor Contact" value={form.exhibitorContact} onChange={(e) => update("exhibitorContact", e.target.value)} />
            <input className="input" placeholder="Exhibitor Email" value={form.exhibitorEmail} onChange={(e) => update("exhibitorEmail", e.target.value)} />
            <input className="input" placeholder="Bill To" value={form.billTo} onChange={(e) => update("billTo", e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Notes</div>
          <div className="form">
            <textarea className="textarea" rows="4" placeholder="Internal notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            <textarea className="textarea" rows="4" placeholder="Special Instructions" value={form.specialInstructions} onChange={(e) => update("specialInstructions", e.target.value)} />
          </div>
        </div>
      </div>

      {error ? <div className="notice">{error}</div> : null}

      <div className="actions-row">
        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create Job"}
        </button>
      </div>
    </form>
  );
}
