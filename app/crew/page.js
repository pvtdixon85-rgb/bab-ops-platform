"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/Shell";

export default function CrewPage() {
  const [crew, setCrew] = useState([]);

  async function loadCrew() {
    const res = await fetch("/api/crew");
    const data = await res.json();
    setCrew(data);
  }

  useEffect(() => {
    loadCrew();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this crew member?")) return;

    await fetch(`/api/crew/${id}`, {
      method: "DELETE",
    });

    loadCrew(); // refresh without reload
  }

  return (
    <Shell title="Crew Directory" subtitle="View BAB crew members">
      <div className="card">
        <div className="section-title">Current Crew</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Region</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
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

                  <td>
                    <button
                      className="button danger"
                      onClick={() =>
                        handleDelete(encodeURIComponent(member.name))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </Shell>
  );
}