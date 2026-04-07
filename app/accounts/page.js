import Shell from "@/components/Shell";
import AccountsManager from "@/components/AccountsManager";
import { requireRole } from "@/lib/auth-session";

export default async function AccountsPage() {
  await requireRole("owner");

  return (
    <Shell title="Accounts" subtitle="Create accounts and assign access for master, owner, hr, manager, lead, and crew.">
      <AccountsManager />
    </Shell>
  );
}
