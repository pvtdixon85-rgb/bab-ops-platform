import Shell from "@/components/Shell";
import { getSession } from "@/lib/auth-session";

export default async function UnauthorizedPage() {
  const session = await getSession();

  return (
    <Shell title="Access Limited" subtitle="Your account is signed in, but this role does not have permission to open that page.">
      <div className="card">
        <div className="section-title">Signed In Account</div>
        <div className="section-sub">
          {session?.email ? `${session.email} • ${session.role}` : "No active session found."}
        </div>
        <div className="notice" style={{ marginTop: 12 }}>
          Contact an owner or master account if you need additional access.
        </div>
      </div>
    </Shell>
  );
}
