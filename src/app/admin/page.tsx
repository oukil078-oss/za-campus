"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, GraduationCap, Award, FileText, Shield, AlertTriangle, Tv, Brain, Download, RefreshCw, ChevronRight, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await fetch("/api/admin/stats"); const d = await r.json(); setStats(d.stats || {}); setRecentUsers(d.recentUsers || []); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  const totalUsers = (stats.totalStudents || 0) + (stats.totalTeachers || 0) + (stats.totalAdmins || 0);
  const cards = [
    { icon: Users, l: "Total Users", v: totalUsers, c: "border-blue-200" },
    { icon: GraduationCap, l: "Students", v: stats.totalStudents || 0, c: "border-violet-200" },
    { icon: Shield, l: "Instructors", v: stats.totalTeachers || 0, c: "border-emerald-200" },
    { icon: BookOpen, l: "Classes", v: stats.totalClasses || 0, c: "border-amber-200" },
    { icon: Award, l: "Credentials", v: stats.certificates || 0, c: "border-teal-200" },
    { icon: AlertTriangle, l: "Restricted", v: stats.banned || 0, c: "border-rose-200" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Administration</p>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">System Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/users")} className="btn-primary !text-xs !px-3 !py-2"><UserPlus className="w-3.5 h-3.5" /> Add User</button>
          <button onClick={load} className="btn-secondary !text-xs !px-3 !py-2"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Health */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-bold text-emerald-800">All systems operational</span>
        <span className="text-xs text-emerald-600 ml-auto">{totalUsers} registered users</span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => (
          <div key={i} className={`card p-4 border-l-2 ${c.c}`}>
            <c.icon className="w-4 h-4 text-gray-400 mb-2" />
            <div className="text-xl font-bold text-gray-900">{c.v}</div>
            <div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{c.l}</div>
          </div>
        ))}
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ l: "Modules", v: stats.totalModules, icon: FileText }, { l: "Assessments", v: stats.totalQuizzes, icon: Brain }, { l: "Videos", v: stats.totalVideos, icon: Tv }, { l: "Files", v: stats.totalFiles, icon: Download }].map((x, i) => (
          <div key={i} className="card p-4 text-center"><x.icon className="w-4 h-4 text-gray-300 mx-auto mb-1.5" /><div className="text-lg font-bold text-gray-900">{x.v ?? "—"}</div><div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{x.l}</div></div>
        ))}
      </div>

      {/* Recent Users + Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Users</h2>
            <button onClick={() => router.push("/admin/users")} className="text-xs font-semibold text-gray-500 hover:text-gray-900">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="table-header"><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {recentUsers.slice(0, 8).map((u: any) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold text-white" style={{ background: "#1a2744" }}>{u.firstName?.[0]}{u.lastName?.[0]}</div><span className="font-semibold">{u.firstName} {u.lastName}</span></div></td>
                    <td className="table-cell text-gray-500">{u.email}</td>
                    <td className="table-cell"><span className={`badge ${u.role === "ADMIN" ? "badge-danger" : u.role === "TEACHER" ? "badge-success" : "badge-info"}`}>{u.role}</span></td>
                    <td className="table-cell">{u.isBanned === "true" ? <span className="badge badge-danger">Restricted</span> : <span className="badge badge-success">Active</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-1.5">
            {[
              { l: "Manage Users", to: "/admin/users" }, { l: "Create Class", to: "/admin/classes" },
              { l: "View Credentials", to: "/admin/certificates" }, { l: "Analytics", to: "/admin/analytics" }
            ].map((a, i) => (
              <button key={i} onClick={() => router.push(a.to)} className="w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-between">
                {a.l} <ChevronRight className="w-3 h-3 text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
