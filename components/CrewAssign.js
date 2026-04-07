
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrewAssign({ jobId, crewDirectory = [], assigned = [] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(assigned || []);
  const [saving, setSaving] = useState(false);

  function toggle(name) {
    if (selected.includes(name)) {
      setSelected(selected.filter((c) => c !== name));
    } else {
      setSelected([...selected, name]);
    }
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/jobs/${jobId}/crew`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crew: selected })
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="section-title">Assign Crew</div>
      <div className="section-sub">Select crew members from directory.</div>

      <div style={{display:"grid",gap:6,marginTop:10}}>
        {crewDirectory.map((m)=>(
          <label key={m.name} style={{display:"flex",gap:8}}>
            <input
              type="checkbox"
              checked={selected.includes(m.name)}
              onChange={()=>toggle(m.name)}
            />
            {m.name} — {m.role}
          </label>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <button className="button" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Crew Assignment"}
        </button>
      </div>
    </div>
  );
}
