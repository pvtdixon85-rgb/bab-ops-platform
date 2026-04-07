export default function StatusPipeline({ summary = {} }) {
  const ordered = [
    "New Lead",
    "Reviewing",
    "Approved",
    "Scheduled",
    "In Progress",
    "Completed",
    "Archived",
  ];

  return (
    <div className="card">
      <div className="section-title">Job Status Pipeline</div>
      <div className="section-sub">Quick view of how many jobs are in each stage.</div>
      <div className="grid-4">
        {ordered.map((status) => (
          <div key={status} className="card">
            <div className="stat-label">{status}</div>
            <div className="stat-value">{summary[status] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
