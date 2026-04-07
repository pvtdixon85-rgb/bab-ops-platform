import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import SessionBadge from "@/components/SessionBadge";
import { getSession, roleAtLeast } from "@/lib/auth-session";

export default async function Shell({ title, subtitle, children }) {
  const session = await getSession();
  const role = session?.role || "crew";

  return (
    <div className="page">
      <header className="topbar">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div>
            <div className="brand">BAB Ops Platform</div>
            <div className="brand-sub">Better At Building • Internal Operations System</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SessionBadge session={session} />
            {session?.email ? <LogoutButton /> : null}
          </div>
        </div>
      </header>

      <div className="container">
        <nav className="nav">
          {roleAtLeast(role, "lead") ? <Link href="/dashboard">Dashboard</Link> : null}
          {roleAtLeast(role, "lead") ? <Link href="/jobs">Jobs</Link> : null}
          {roleAtLeast(role, "manager") ? <Link href="/jobs/new">Create Job</Link> : null}
          {roleAtLeast(role, "crew") ? <Link href="/calendar">Calendar</Link> : null}
          {roleAtLeast(role, "lead") ? <Link href="/crew">Crew</Link> : null}
          {roleAtLeast(role, "owner") ? <Link href="/accounts">Accounts</Link> : null}
        </nav>

        <main>
          <section className="hero">
            <h1>{title}</h1>
            {subtitle ? <p className="hero-sub">{subtitle}</p> : null}
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}
