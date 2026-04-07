import Shell from "@/components/Shell";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Shell title="Management Login" subtitle="BAB Ops Platform is restricted to approved management accounts.">
      <div className="card">
        <div className="section-title">Sign In</div>
        <div className="section-sub">Starter admin account is already set up, and you can create more accounts after logging in.</div>
        <div className="notice">Default login: pvt.dixon85@gmail.com</div>
        <LoginForm />
      </div>
    </Shell>
  );
}
