import { readJobs } from "@/lib/data-store";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";

export default function CalendarPage() {
  const jobs = readJobs();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  function getJobsForDay(day) {
    return jobs.filter(job => {
      const startRaw =
        job.start ||
        job.startDate ||
        job.date ||
        job.start_date;

      const endRaw =
        job.end ||
        job.endDate ||
        job.end_date ||
        startRaw;

      if (!startRaw) return false;

      const startDate = new Date(startRaw);
      const endDate = new Date(endRaw);
      const currentDate = new Date(year, month, day);

      return currentDate >= startDate && currentDate <= endDate;
    });
  }

  function statusColor(status) {
    switch (status) {
      case "Scheduled": return "#4caf50";
      case "In Progress": return "#2196f3";
      case "Completed": return "#9e9e9e";
      case "Reviewing": return "#ff9800";
      default: return "#607d8b";
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/dashboard">
        <button style={{ marginBottom: "10px" }}>
          ← Back to Dashboard
        </button>
      </Link>

      <h1>
        {today.toLocaleString("default", { month: "long" })} {year}
      </h1>

      <PrintButton />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          marginTop: "20px"
        }}
      >
        {days.map((day, i) => (
          <div
            key={i}
            style={{
              border: "1px solid black",
              minHeight: "120px",
              padding: "5px"
            }}
          >
            {day && (
              <>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {day}
                </div>

                {getJobsForDay(day).map(job => (
                  <div
                    key={job.id}
                    style={{
                      border: "1px solid #333",
                      padding: "4px",
                      marginBottom: "4px",
                      fontSize: "12px",
                      background: statusColor(job.status),
                      color: "white"
                    }}
                  >
                    <strong>{job.show}</strong>
                    <div>{job.client}</div>

                    <div style={{ fontSize: "10px" }}>
                      {job.location}
                    </div>

                    {job.crew && job.crew.length > 0 && (
                      <div style={{ fontSize: "10px" }}>
                        👥 {job.crew.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
