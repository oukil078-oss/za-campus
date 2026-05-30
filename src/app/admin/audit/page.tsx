"use client";
import { useEffect, useState } from "react";
import { ScrollText, Clock, User, Shield } from "lucide-react";

const sampleLogs = [
  { action: "LOGIN", entity: "USER", entityId: "admin@zacampus.dz", details: "Admin login", createdAt: new Date().toISOString() },
  { action: "CREATE", entity: "MODULE", entityId: "Module 1", details: "New module created", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { action: "BAN", entity: "USER", entityId: "user@test.com", details: "User banned", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { action: "UPDATE", entity: "CLASS", entityId: "CS-AI-101", details: "Class updated", createdAt: new Date(Date.now() - 14400000).toISOString() },
  { action: "SUBMIT", entity: "QUIZ", entityId: "Quiz #1", details: "Quiz submitted", createdAt: new Date(Date.now() - 28800000).toISOString() },
];

export default function AdminAuditPage() {
  const [logs] = useState(sampleLogs);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">System</p>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">System activity and administrative actions</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header"><tr><th>Action</th><th>Entity</th><th>Target</th><th>Details</th><th className="w-40">Timestamp</th></tr></thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell">
                    <span className={`badge ${log.action === "LOGIN" ? "badge-info" : log.action === "BAN" ? "badge-danger" : log.action === "CREATE" ? "badge-success" : "badge-neutral"}`}>{log.action}</span>
                  </td>
                  <td className="table-cell text-gray-500">{log.entity}</td>
                  <td className="table-cell text-xs text-gray-400 font-mono">{log.entityId}</td>
                  <td className="table-cell text-gray-600">{log.details}</td>
                  <td className="table-cell text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Audit Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Logins today", v: "12", icon: User },
            { l: "Content changes", v: "8", icon: ScrollText },
            { l: "Admin actions", v: "3", icon: Shield },
            { l: "Total events", v: "47", icon: Clock },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-md bg-gray-50 text-center">
              <s.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{s.v}</div>
              <div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
