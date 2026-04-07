"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");

      const target = data?.role === "crew" ? "/unauthorized" : (data?.role === "lead" ? "/calendar" : "/dashboard");
          window.location.href = target;
    } catch (err) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" style={{ maxWidth: 520 }} onSubmit={handleSubmit}>
      <div>
        <div style={{ marginBottom: 8 }}>Email</div>
        <input
          className="input"
          type="email"
          placeholder="manager@babinstallers.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <div style={{ marginBottom: 8 }}>Password</div>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="actions-row">
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      {message ? <div className="notice">{message}</div> : null}
    </form>
  );
}
