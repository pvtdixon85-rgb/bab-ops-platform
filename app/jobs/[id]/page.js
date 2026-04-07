import Link from "next/link";
import Shell from "@/components/Shell";
import PrintButton from "@/components/PrintButton";
import JobAdminPanel from "@/components/JobAdminPanel";
import AttachmentUploader from "@/components/AttachmentUploader";
import AttachmentManager from "@/components/AttachmentManager";
import LeadChecklist from "@/components/LeadChecklist";
import LeadPacketSummary from "@/components/LeadPacketSummary";
import PacketBuilderButton from "@/components/PacketBuilderButton";
import { readJobs, readCrew } from "@/lib/data-store";
import CrewAssign from "@/components/CrewAssign";
import { formatTime } from "@/lib/formatters";
import { requireRole } from "@/lib/auth-session";

export default async function JobDetailPage({ params }) {
  await requireRole("lead");
    const jobs = readJobs();
  const job = jobs.find((item) => item.id === params.id) || jobs[0];
  const crewDirectory = readCrew();

  return (
    <Shell title={job.show || "Job Detail"} subtitle="Detailed BAB job record for management review, staffing, and attachment tracking.">
      <div className="actions-row no-print">
        <Link className="button" href={`/jobs/${job.id}/labor-order`}>Generate BAB Labor Order</Link>
        <PrintButton />
            <PacketBuilderButton jobId={job.id} />
      </div>

      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="section-title">BAB Job Information</div>
          <div className="list">
            <div className="list-item"><strong>Job ID:</strong> {job.id}</div>
            <div className="list-item"><strong>Client:</strong> {job.client}</div>
            <div className="list-item"><strong>Show:</strong> {job.show}</div>
            <div className="list-item"><strong>Location:</strong> {job.location}</div>
            <div className="list-item"><strong>Venue:</strong> {job.venue || "TBD"}</div>
            <div className="list-item"><strong>Dates:</strong> {job.start} to {job.end}</div>
            <div className="list-item"><strong>Times:</strong> {formatTime(job.installTime)} to {formatTime(job.dismantleTime)}</div>
            <div className="list-item"><strong>Booth # / Size:</strong> {job.boothNumber || "TBD"} • {job.booth || "TBD"}</div>
            <div className="list-item"><strong>Labor Needed:</strong> {job.labor || "TBD"}</div>
            <div className="list-item"><strong>Status:</strong> {job.status || "Request Received"}</div>
            <div className="list-item"><strong>City Lead:</strong> {job.cityLead || "TBD"}</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div className="card">
            <div className="section-title">Crew</div>
            <div className="list">
              {(job.crew && job.crew.length ? job.crew : ["Open Slot 1", "Open Slot 2"]).map((member) => (
                <div key={member} className="list-item">{member}</div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Attachments</div>
            <div className="list">
              {(job.attachments && job.attachments.length ? job.attachments : []).map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="list-item">
                  <strong>{file.type}:</strong> {file.url ? <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a> : file.name}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Notes</div>
            <div className="list">
              <div className="list-item"><strong>Internal Notes:</strong><br />{job.notes || "None"}</div>
              <div className="list-item"><strong>Special Instructions:</strong><br />{job.specialInstructions || "None"}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 18 }} />
      <AttachmentUploader jobId={job.id} />
      <div style={{ height: 18 }} />
      <JobAdminPanel job={job} />
    </Shell>
  );
}