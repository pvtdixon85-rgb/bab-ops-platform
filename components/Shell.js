import Link from "next/link";

export default function Shell({ title, subtitle, children }) {
  return (
    <div className="page">
      <header className="topbar">
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <div className="brand">BAB Ops Platform</div>
            <div className="brand-sub">
              Better At Building • Internal Operations System
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/crew">Crew</Link>
        </nav>

        <div className="content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}