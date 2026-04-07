import fs from "fs";
import path from "path";

const jobsPath = path.join(process.cwd(), "data", "jobs.json");
const crewPath = path.join(process.cwd(), "data", "crew.json");

function ensureFile(filePath, fallback = "[]") {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, fallback, "utf-8");
}

export function readJobs() {
  ensureFile(jobsPath, "[]");
  return JSON.parse(fs.readFileSync(jobsPath, "utf-8") || "[]");
}

export function writeJobs(jobs) {
  ensureFile(jobsPath, "[]");
  fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2), "utf-8");
}

export function nextJobNumber() {
  const jobs = readJobs();
  const year = new Date().getFullYear();
  const maxNum = jobs.reduce((acc, job) => {
    const match = String(job.id || "").match(/BAB-\d{4}-(\d+)/);
    return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
  }, 0);
  return `BAB-${year}-${String(maxNum + 1).padStart(3, "0")}`;
}

export function updateJob(id, updates) {
  const jobs = readJobs();
  const next = jobs.map((job) => job.id === id ? { ...job, ...updates } : job);
  writeJobs(next);
  return next.find((job) => job.id === id);
}

export function deleteJob(id) {
  const jobs = readJobs();
  const next = jobs.filter((job) => job.id !== id);
  writeJobs(next);
  return true;
}

export function duplicateJob(id) {
  const jobs = readJobs();
  const original = jobs.find((job) => job.id === id);
  if (!original) return null;
  const copy = { ...original, id: nextJobNumber(), status: "Request Received", start: "", end: "", installTime: "", dismantleTime: "" };
  jobs.unshift(copy);
  writeJobs(jobs);
  return copy;
}

export function addAttachmentToJob(id, attachment) {
  const jobs = readJobs();
  const next = jobs.map((job) => {
    if (job.id !== id) return job;
    const attachments = Array.isArray(job.attachments) ? job.attachments : [];
    return { ...job, attachments: [...attachments, attachment] };
  });
  writeJobs(next);
  return next.find((job) => job.id === id);
}

export function removeAttachmentFromJob(id, fileName) {
  const jobs = readJobs();
  const next = jobs.map((job) => {
    if (job.id !== id) return job;
    const attachments = Array.isArray(job.attachments) ? job.attachments : [];
    return { ...job, attachments: attachments.filter((a) => a.name !== fileName) };
  });
  writeJobs(next);
  return next.find((job) => job.id === id);
}

export function readCrew() {
  ensureFile(crewPath, "[]");
  return JSON.parse(fs.readFileSync(crewPath, "utf-8") || "[]");
}

export function writeCrew(crew) {
  ensureFile(crewPath, "[]");
  fs.writeFileSync(crewPath, JSON.stringify(crew, null, 2), "utf-8");
}

export function addCrewMember(member) {
  const crew = readCrew();
  crew.push(member);
  writeCrew(crew);
  return member;
}

export function deleteCrewMember(name) {
  const crew = readCrew().filter((item) => item.name !== name);
  writeCrew(crew);
  return true;
}


export function removeAttachmentFromJobByStoredName(id, storedName) {
  const jobs = readJobs();
  const next = jobs.map((job) => {
    if (job.id !== id) return job;
    const attachments = Array.isArray(job.attachments) ? job.attachments : [];
    return { ...job, attachments: attachments.filter((a) => a.storedName !== storedName) };
  });
  writeJobs(next);
  return next.find((job) => job.id === id);
}


export function statusSummary() {
  const jobs = readJobs();
  const statuses = [
    "New Lead",
    "Reviewing",
    "Approved",
    "Scheduled",
    "In Progress",
    "Completed",
    "Archived",
  ];
  const summary = {};
  statuses.forEach((s) => summary[s] = 0);
  jobs.forEach((job) => {
    const status = job.status || "New Lead";
    if (!(status in summary)) summary[status] = 0;
    summary[status] += 1;
  });
  return summary;
}
