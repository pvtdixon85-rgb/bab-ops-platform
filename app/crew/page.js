import Shell from "@/components/Shell";
import { readCrew } from "@/lib/data-store";
import CrewManager from "@/components/CrewManager";
import { requireRole, getSession, roleAtLeast } from "@/lib/auth-session";

export default async function CrewPage() {
  await requireRole("lead");
  const session = await getSession();
  const crew = readCrew();
  const canManageCrew = roleAtLeast(session?.role || "crew", "hr");

  return (
    <Shell title="Crew Directory" subtitle="View BAB crew members, regions, and contact information.">
      <div className="card">
        <div className="section-title">Current Crew</div>
        <div className="section-sub">
          {canManageCrew
            ? "This directory feeds crew assignment throughout the platform."
            : "You can view the crew directory, but only HR, owner, and master accounts can add or remove crew members."}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Region</th><th>Phone</th><th>Email</th>
              </tr>
            </thead>
            <tbody>
              {crew.map((member) => (
                <tr key={member.name}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.region}</td>
                  <td>{member.phone || "-"}</td>
                  <td>{member.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManageCrew ? (
        <>
          <div style={{ height: 18 }} />
          <CrewManager />
        </>
      ) : null}
    </Shell>
  );
}
