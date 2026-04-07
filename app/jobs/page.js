import Link from "next/link";
import Shell from "@/components/Shell";
import { readJobs } from "@/lib/data-store";
import { requireRole } from "@/lib/auth-session";

export default async function JobsPage() {
  await requireRole("lead");
    const jobs = readJobs();

  return (
    <Shell title="Jobs" subtitle="Review all BAB jobs, requests, and scheduled show work.">
      <div className="card">
        <div className="section-title">Job Records</div>
        <div className="section-sub">Open a job to view client info, notes, attachments, and assignments.</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job ID</th><th>Show</th><th>Client</th><th>Location</th><th>Dates</th><th>Status</th><th>Packet</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td><Link href={`/jobs/${job.id}`} style={{ color: "#ffd1a3", fontWeight: 700 }}>{job.id}</Link></td>
                  <td>{job.show}</td>
                  <td>{job.client}</td>
                  <td>{job.location}</td>
                  <td>{job.start} to {job.end}</td>
                  <td>{job.status}</td>
                  <td><Link href={`/jobs/${job.id}/labor-order`} style={{ color: "#ffd1a3", fontWeight: 700 }}>BAB Labor Order</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}