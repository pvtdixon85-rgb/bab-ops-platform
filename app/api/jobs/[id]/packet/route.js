import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { readJobs } from "@/lib/data-store";
import { formatTime } from "@/lib/formatters";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function makePdfBuffer(job) {
  try {
    const mod = await import("pdfkit");
    const PDFDocument = mod.default || mod;
    return await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const attachments = Array.isArray(job.attachments) ? job.attachments : [];
      const crew = Array.isArray(job.crew) && job.crew.length ? job.crew : ["Open Slot 1", "Open Slot 2"];

      doc.fontSize(22).text("BAB Labor Order");
      doc.fontSize(10).fillColor("#666").text("Better At Building (BAB I&D) • Internal Operations Packet");
      doc.moveDown();
      doc.fillColor("#000");

      doc.fontSize(14).text("Client & Billing");
      doc.fontSize(11)
        .text(`Client: ${job.client || "TBD"}`)
        .text(`Bill To: ${job.billTo || job.client || "TBD"}`)
        .text(`Account Manager: ${job.accountManager || "BAB Management"}`)
        .text(`Exhibitor Contact: ${job.exhibitorContact || "TBD"}`)
        .text(`Exhibitor Email: ${job.exhibitorEmail || ""}`);

      doc.moveDown();
      doc.fontSize(14).text("Show Information");
      doc.fontSize(11)
        .text(`Job #: ${job.id}`)
        .text(`Status: ${job.status || "New Lead"}`)
        .text(`Project Manager: ${job.projectManager || "Aaron Dixon"}`)
        .text(`City Lead: ${job.cityLead || "TBD"}`)
        .text(`Show Name: ${job.show || "TBD"}`)
        .text(`Venue: ${job.venue || "TBD"}`)
        .text(`Location: ${job.location || "TBD"}`)
        .text(`Booth: ${(job.boothNumber || "TBD")} • ${(job.booth || "TBD")}`);

      doc.moveDown();
      doc.fontSize(14).text("Schedule");
      doc.fontSize(11)
        .text(`Install: ${job.start || "TBD"} at ${formatTime(job.installTime)}`)
        .text(`Dismantle: ${job.end || "TBD"} at ${formatTime(job.dismantleTime)}`)
        .text(`Labor Needed: ${job.labor || "TBD"}`);

      doc.moveDown();
      doc.fontSize(14).text("Assigned Crew");
      crew.forEach((member, idx) => doc.fontSize(11).text(`${idx + 1}. ${member}`));

      doc.moveDown();
      doc.fontSize(14).text("Attachments Included In Packet");
      if (attachments.length) {
        attachments.forEach((file, idx) => doc.fontSize(11).text(`${idx + 1}. ${file.type || "Attachment"}: ${file.name}`));
      } else {
        doc.fontSize(11).text("None added yet");
      }

      doc.moveDown();
      doc.fontSize(14).text("Special Instructions");
      doc.fontSize(11).text(job.specialInstructions || job.notes || "None provided");
      doc.moveDown(0.5);
      doc.fontSize(11).text("Required Closeout: Final booth photos, issue notes, and completed walk-through confirmation.");
      doc.end();
    });
  } catch (error) {
    return { pdfError: String(error?.message || error) };
  }
}

function buildLaborOrderHtml(job) {
  const attachments = Array.isArray(job.attachments) ? job.attachments : [];
  const crew = Array.isArray(job.crew) && job.crew.length ? job.crew : ["Open Slot 1", "Open Slot 2"];
  return `<!doctype html><html><head><meta charset="utf-8" /><title>${esc(job.id)} - BAB Labor Order</title>
<style>body{font-family:Arial,Helvetica,sans-serif;margin:24px;color:#111}h1,h2,h3{margin:0 0 10px}.small{color:#555;font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px}.box{border:1px solid #ccc;border-radius:8px;padding:12px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:13px;vertical-align:top}.full{grid-column:1 / -1}ul{margin:8px 0 0 18px}</style>
</head><body><h1>BAB Labor Order</h1><div class="small">Better At Building (BAB I&D) • Internal Operations Packet</div>
<div class="grid">
<div class="box"><h3>Client & Billing</h3><p><strong>Client:</strong> ${esc(job.client || "TBD")}</p><p><strong>Bill To:</strong> ${esc(job.billTo || job.client || "TBD")}</p><p><strong>Account Manager:</strong> ${esc(job.accountManager || "BAB Management")}</p><p><strong>Exhibitor Contact:</strong> ${esc(job.exhibitorContact || "TBD")}<br>${esc(job.exhibitorEmail || "")}</p></div>
<div class="box"><h3>Show Information</h3><p><strong>Job #:</strong> ${esc(job.id)}</p><p><strong>Status:</strong> ${esc(job.status || "New Lead")}</p><p><strong>Show Name:</strong> ${esc(job.show || "TBD")}</p><p><strong>Venue:</strong> ${esc(job.venue || "TBD")}</p><p><strong>Location:</strong> ${esc(job.location || "TBD")}</p><p><strong>Booth:</strong> ${esc(job.boothNumber || "TBD")} • ${esc(job.booth || "TBD")}</p></div>
<div class="box"><h3>Schedule</h3><table><thead><tr><th>Phase</th><th>Date</th><th>Time</th><th>Labor</th></tr></thead><tbody><tr><td>Install</td><td>${esc(job.start || "TBD")}</td><td>${esc(formatTime(job.installTime))}</td><td>${esc(job.labor || "TBD")}</td></tr><tr><td>Dismantle</td><td>${esc(job.end || "TBD")}</td><td>${esc(formatTime(job.dismantleTime))}</td><td>${esc(job.labor || "TBD")}</td></tr></tbody></table></div>
<div class="box"><h3>Assigned Crew</h3><p><strong>City Lead:</strong> ${esc(job.cityLead || "TBD")}</p><ul>${crew.map((m) => `<li>${esc(m)}</li>`).join("")}</ul></div>
<div class="box full"><h3>Attachments Included In Packet</h3><ul>${attachments.length ? attachments.map((a) => `<li>${esc(a.type || "Attachment")}: ${esc(a.name)}</li>`).join("") : "<li>None added yet</li>"}</ul></div>
<div class="box full"><h3>Special Instructions</h3><p>${esc(job.specialInstructions || job.notes || "None provided")}</p><p><strong>Required Closeout:</strong> Final booth photos, issue notes, and completed walk-through confirmation.</p></div>
</div></body></html>`;
}

export async function GET(_req, { params }) {
  try {
    const jobs = readJobs();
    const job = jobs.find((item) => item.id === params.id);
    if (!job) return new Response("Job not found", { status: 404 });

    const zip = new JSZip();
    const folder = zip.folder(`${job.id}-BAB-Packet`);

    const pdfResult = await makePdfBuffer(job);
    if (Buffer.isBuffer(pdfResult)) {
      folder.file("BAB-Labor-Order.pdf", pdfResult);
    } else {
      folder.file("PDF-ERROR.txt", `PDF generation failed.\n\nReason:\n${pdfResult?.pdfError || "Unknown error"}\n\nRun npm install again and retry.`);
    }

    folder.file("BAB-Labor-Order.html", buildLaborOrderHtml(job));

    const attachments = Array.isArray(job.attachments) ? job.attachments : [];
    const uploadsDir = path.join(process.cwd(), "public", "uploads", job.id);

    attachments.forEach((file) => {
      if (file && file.storedName) {
        const fullPath = path.join(uploadsDir, file.storedName);
        if (fs.existsSync(fullPath)) folder.file(file.name || file.storedName, fs.readFileSync(fullPath));
      }
    });

    folder.file("README.txt", `BAB Lead Packet\n\nJob: ${job.id}\nShow: ${job.show || ""}\nClient: ${job.client || ""}\n\nThis packet includes the BAB labor order and uploaded attachments.`);

    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${job.id}-BAB-Packet.zip"`,
      },
    });
  } catch (error) {
    return new Response(`Packet builder failed: ${error?.message || error}`, { status: 500 });
  }
}
