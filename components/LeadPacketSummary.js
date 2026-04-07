export default function LeadPacketSummary({ job }) {
  const attachments = Array.isArray(job.attachments) ? job.attachments : [];
  const byType = {};
  attachments.forEach((a) => {
    const key = a.type || "Attachment";
    byType[key] = byType[key] || [];
    byType[key].push(a.name);
  });

  return (
    <div className="card">
      <div className="section-title">Lead Packet Summary</div>
      <div className="section-sub">Quick view of what the lead should have before heading to the show floor.</div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ fontSize: 18 }}>Core Job Info</div>
          <div className="list">
            <div className="list-item"><strong>Show:</strong> {job.show || "TBD"}</div>
            <div className="list-item"><strong>Client:</strong> {job.client || "TBD"}</div>
            <div className="list-item"><strong>Venue:</strong> {job.venue || "TBD"}</div>
            <div className="list-item"><strong>Lead:</strong> {job.cityLead || "TBD"}</div>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ fontSize: 18 }}>Packet Contents</div>
          <div className="list">
            <div className="list-item">BAB Labor Order</div>
            <div className="list-item">Crew Assignments</div>
            <div className="list-item">Install / Dismantle Checklists</div>
            {Object.keys(byType).length ? Object.entries(byType).map(([type, files]) => (
              <div key={type} className="list-item"><strong>{type}:</strong> {files.join(", ")}</div>
            )) : <div className="list-item">No categorized files added yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
