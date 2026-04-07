"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AttachmentUploader({ jobId }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Attachment");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setMessage("Choose a file first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch(`/api/jobs/${jobId}/attachments`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("upload failed");
      setMessage("File uploaded.");
      setFile(null);
      const input = document.getElementById("job-file-input");
      if (input) input.value = "";
      router.refresh();
    } catch {
      setMessage("Could not upload file.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title">Upload Attachment</div>
      <div className="section-sub">Upload a real file and attach it to this BAB job.</div>

      <form className="form" style={{ maxWidth: "100%" }} onSubmit={handleUpload}>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option>Attachment</option>
          <option>Rendering</option>
          <option>Floor Plan</option>
          <option>Graphics</option>
          <option>Install Notes</option>
          <option>Photo</option>
        </select>

        <input
          id="job-file-input"
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="actions-row">
          <button className="button" type="submit" disabled={saving}>
            {saving ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {message ? <div className="notice">{message}</div> : null}
      </form>
    </div>
  );
}
