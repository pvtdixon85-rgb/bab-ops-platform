import Shell from "@/components/Shell";
import StatusPipeline from "@/components/StatusPipeline";
import { readJobs, statusSummary } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

function badgeClass(status) {
  if (status === "Approved" || status === "Scheduled") return "badge scheduled";
  if (status === "Reviewing") return "badge reviewing";
  if (status === "In Progress") return "badge progress";
  if (status === "Completed" || status === "Archived") return "badge new";
  return "badge new";
}

export default async function DashboardPage() {
  await requireRole("lead");
    const jobs = readJobs();
  const summary = statusSummary();

  const stats = [
    { label: "New Leads", value: summary["New Lead"] || 0 },
    { label: "Scheduled Jobs", value: summary["Scheduled"] || 0 },
    { label: "In Progress", value: summary["In Progress"] || 0 },
    { label: "Completed", value: summary["Completed"] || 0 },
  ];

  return (
    <Shell title="BAB Management Dashboard" subtitle="Internal dashboard for BAB jobs, schedules, packets, and crew assignments.">
      <section className="grid-4">
        {stats.map((item) => (
          <div key={item.label} className="card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </section>

      <div style={{ height: 20 }} />
      <StatusPipeline summary={summary} />
      <div style={{ height: 20 }} />

      <section className="grid-2">
        <div className="card">
          <div className="section-title">Active BAB Jobs</div>
          <div className="section-sub">Track leads, approved work, and active show-floor jobs.</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th><th>Client</th><th>Dates</th><th>Booth</th><th>Labor</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td><strong>{job.show}</strong><div className="muted" style={{ fontSize: 12 }}>{job.id}</div><div className="muted" style={{ fontSize: 12 }}>{job.location}</div></td>
                    <td>{job.client}</td>
                    <td>{job.start}<div className="muted" style={{ fontSize: 12 }}>to {job.end}</div></td>
                    <td>{job.booth}</td>
                    <td>{job.labor}</td>
                    <td><span className={badgeClass(job.status)}>{job.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Pipeline Notes</div>
          <div className="section-sub">Use these stages to manage work from intake to archive.</div>
          <div className="list">
            <div className="list-item"><strong>New Lead</strong> — initial request or intake</div>
            <div className="list-item"><strong>Reviewing</strong> — scope, files, and labor needs under review</div>
            <div className="list-item"><strong>Approved</strong> — ready to move forward</div>
            <div className="list-item"><strong>Scheduled</strong> — dates and crew planning locked in</div>
            <div className="list-item"><strong>In Progress</strong> — active show work</div>
            <div className="list-item"><strong>Completed</strong> — show work done</div>
            <div className="list-item"><strong>Archived</strong> — closed and retained for records</div>
          </div>
        </div>
      </section>
    </Shell>
  );
}