import Shell from "@/components/Shell";
import JobForm from "@/components/JobForm";
import { requireRole } from "@/lib/auth-session";

export default async function NewJobPage() {
  await requireRole("manager");
    return (
    <Shell
      title="Create Job"
      subtitle="Create a real job record with custom start/end dates and times that saves into the platform and feeds the dashboard, calendar, and BAB labor order."
    >
      <JobForm />
    </Shell>
  );
}