"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Rendering", "Floor Plan", "Graphics", "Install Notes", "Photo", "Attachment"];

export default function AttachmentManager({ jobId, attachments = [] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [replaceFor, setReplaceFor] = useState("");
  const [replaceType, setReplaceType] = useState("Attachment");

  const grouped = useMemo(() => {
    const groups = {};
    categories.forEach((c) => (groups[c] = []));
    attachments.forEach((file) => {
      const key = categories.includes(file.type) ? file.type : "Attachment";
      groups[key].push(file);
    });
    return groups;
  }, [attachments]);

  async function removeAttachment(file) {
    setBusy(file.storedName || file.name);
    setMessage("");
    try {
      const res = await fetch(`/api/jobs/${jobId}/attachments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storedName: file.storedName, name: file.name }),
      });
      if (!res.ok) throw new Error("delete failed");
      setMessage("Attachment removed.");
      router.refresh();
    } catch {
      setMessage("Could not remove attachment.");
    } finally {
      setBusy("");
    }
  }

  async function addFakeFiles() {
    setBusy("fake");
    setMessage("");
    try {
      const res = await fetch(`/api/jobs/${jobId}/attachments/fake`, { method: "POST" });
      if (!res.ok) throw new Error("fake failed");
      setMessage("Fake test files added.");
      router.refresh();
    } catch {
      setMessage("Could not add fake files.");
    } finally {
      setBusy("");
    }
  }

  async function handleReplace(file, newFile) {
    if (!newFile) return;
    setBusy(file.storedName || file.name);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("storedName", file.storedName || "");
      formData.append("type", replaceType || file.type || "Attachment");

      const res = await fetch(`/api/jobs/${jobId}/attachments/replace`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("replace failed");
      setReplaceFor("");
      setMessage("Attachment replaced.");
      router.refresh();
    } catch {
      setMessage("Could not replace attachment.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="card">
      <div className="section-title">Attachment Management</div>
      <div className="section-sub">Organize files by category, remove uploads, or replace them for testing.</div>

      <div className="actions-row">
        <button className="button secondary" type="button" onClick={addFakeFiles} disabled={busy === "fake"}>
          {busy === "fake" ? "Adding..." : "Add Fake Test Files"}
        </button>
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {categories.map((category) => (
          <div key={category} className="card">
            <div className="section-title" style={{ fontSize: 18 }}>{category}</div>
            <div className="list">
              {grouped[category].length ? grouped[category].map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="list-item">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div>
                      <div><strong>{file.name}</strong></div>
                      <div className="muted" style={{ fontSize: 12 }}>{file.url || "No URL"}</div>
                    </div>
                    <div className="actions-row">
                      <button className="button secondary" type="button" onClick={() => { setReplaceFor(file.storedName || file.name); setReplaceType(file.type || "Attachment"); }}>
                        Replace
                      </button>
                      <button className="button secondary" type="button" onClick={() => removeAttachment(file)} disabled={busy === (file.storedName || file.name)}>
                        {busy === (file.storedName || file.name) ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>

                  {replaceFor === (file.storedName || file.name) ? (
                    <div className="form" style={{ marginTop: 12 }}>
                      <select className="input" value={replaceType} onChange={(e) => setReplaceType(e.target.value)}>
                        {categories.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <input className="input" type="file" onChange={(e) => handleReplace(file, e.target.files?.[0] || null)} />
                    </div>
                  ) : null}
                </div>
              )) : (
                <div className="list-item">{`No ${category.toLowerCase()} files yet.`}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {message ? <div className="notice">{message}</div> : null}
    </div>
  );
}
