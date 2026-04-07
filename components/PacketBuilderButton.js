"use client";

export default function PacketBuilderButton({ jobId }) {
  function handleDownload() {
    window.location.href = `/api/jobs/${jobId}/packet`;
  }

  return (
    <button className="button secondary" type="button" onClick={handleDownload}>
      Download BAB Packet ZIP
    </button>
  );
}
