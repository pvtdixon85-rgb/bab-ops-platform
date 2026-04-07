export default function SessionBadge({ session }) {
  if (!session?.email) return null;
  return (
    <div className="muted" style={{ fontSize: 12, textAlign: "right" }}>
      <div>{session.email}</div>
      <div>Role: {session.role}</div>
    </div>
  );
}
