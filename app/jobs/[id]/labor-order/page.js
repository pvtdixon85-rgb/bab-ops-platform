import Link from "next/link";
import Shell from "@/components/Shell";
import PrintButton from "@/components/PrintButton";
import { readJobs } from "@/lib/data-store";
import { formatTime } from "@/lib/formatters";
import PacketBuilderButton from "@/components/PacketBuilderButton";
import { requireRole } from "@/lib/auth-session";

export default async function LaborOrderPage({ params }) {
  await requireRole("lead");
    const jobs = readJobs();
  const job = jobs.find((item) => item.id === params.id) || jobs[0];
  const attachments = Array.isArray(job.attachments) ? job.attachments : [];

  return (
    <Shell title="BAB Labor Order" subtitle="Printable management packet for BAB leads and show labor.">
      <div className="actions-row no-print">
        <PrintButton label="Print / Save PDF" className="button" />
        <Link className="button secondary" href={`/jobs/${job.id}`}>Back to Job</Link>
            <PacketBuilderButton jobId={job.id} />
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="lo-header">
          <div>
            <h2 className="lo-title">BAB Labor Order</h2>
            <div className="lo-sub">Better At Building (BAB I&D) • Internal Operations Packet</div>
          </div>
          <div className="lo-meta">
            <div><strong>Job #:</strong> {job.id}</div>
            <div><strong>Status:</strong> {job.status || "New Lead"}</div>
            <div><strong>Project Manager:</strong> {job.projectManager || "Aaron Dixon"}</div>
            <div><strong>City Lead:</strong> {job.cityLead || "TBD"}</div>
          </div>
        </div>

        <div className="lo-grid">
          <section className="lo-section">
            <h3>Client & Billing</h3>
            <div className="kv">
              <div><b>Client</b>{job.client || "TBD"}</div>
              <div><b>Bill To</b>{job.billTo || job.client || "TBD"}</div>
              <div><b>Account Manager</b>{job.accountManager || "BAB Management"}</div>
              <div><b>Exhibitor Contact</b>{job.exhibitorContact || "TBD"}<br />{job.exhibitorEmail || ""}</div>
            </div>
          </section>

          <section className="lo-section">
            <h3>Show Information</h3>
            <div className="kv">
              <div><b>Show Name</b>{job.show || "TBD"}</div>
              <div><b>Venue</b>{job.venue || "TBD"}</div>
              <div><b>Location</b>{job.location || "TBD"}</div>
              <div><b>Booth Number / Size</b>{job.boothNumber || "TBD"} • {job.booth || "TBD"}</div>
            </div>
          </section>

          <section className="lo-section">
            <h3>Schedule</h3>
            <table className="lo-table">
              <thead>
                <tr><th>Phase</th><th>Date</th><th>Time</th><th>Labor</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Install</td>
                  <td>{job.start || "TBD"}</td>
                  <td>{formatTime(job.installTime)}</td>
                  <td>{job.labor || "TBD"}</td>
                </tr>
                <tr>
                  <td>Dismantle</td>
                  <td>{job.end || "TBD"}</td>
                  <td>{formatTime(job.dismantleTime)}</td>
                  <td>{job.labor || "TBD"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="lo-section">
            <h3>Assigned Crew</h3>
            <table className="lo-table">
              <thead><tr><th>Role</th><th>Name</th></tr></thead>
              <tbody>
                <tr><td>City Lead</td><td>{job.cityLead || "TBD"}</td></tr>
                {(job.crew && job.crew.length ? job.crew : ["Open Slot 1", "Open Slot 2"]).map((member) => (
                  <tr key={member}><td>Crew</td><td>{member}</td></tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="lo-section">
            <h3>Packet Files & Deliverables</h3>
            <table className="lo-table">
              <thead><tr><th>Document</th><th>Name / Link</th></tr></thead>
              <tbody>
                {attachments.length ? attachments.map((file, idx) => (
                  <tr key={`${file.name}-${idx}`}>
                    <td>{file.type || "Attachment"}</td>
                    <td>
                      {file.url ? (
                        <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                      ) : (
                        file.name
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td>Attachment</td><td>None added yet</td></tr>
                )}
              </tbody>
            </table>
          </section>

          
              <section className="lo-section" style={{ gridColumn: "1 / -1" }}>
                <h3>Lead Checklists</h3>
                <table className="lo-table">
                  <thead><tr><th>Install</th><th>Dismantle</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>
                        Confirm booth location<br />
                        Review renderings and floor plan<br />
                        Check electrical / lighting requirements<br />
                        Install graphics and structural components<br />
                        Client walkthrough completed
                      </td>
                      <td>
                        Graphics removed<br />
                        Crates packed<br />
                        Carpet / flooring cleared<br />
                        Tool count complete<br />
                        Labor signed out
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="lo-section" style={{ gridColumn: "1 / -1" }}>
            <h3>Special Instructions</h3>
            <div className="kv">
              <div><b>Lead Notes</b>{job.specialInstructions || job.notes || "None provided"}</div>
              <div><b>Required Closeout</b>Final booth photos, issue notes, and completed walk-through confirmation.</div>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}