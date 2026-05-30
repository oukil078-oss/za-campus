"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, GraduationCap, Award, FileText, Shield, AlertTriangle, Tv, Brain, Download, RefreshCw, ChevronRight } from "lucide-react";
import { StatCard, Badge, Spinner } from "@/components/ui";

type Stats = Record<string, number>;

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({});
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await fetch("/api/admin/stats"); const d = await r.json(); setStats(d.stats || {}); setRecentUsers(d.recentUsers || []); setClassStats(d.classStats || []); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  const totalUsers = (stats.totalStudents || 0) + (stats.totalTeachers || 0) + (stats.totalAdmins || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-gray-500 mt-1 text-sm">Complete platform oversight</p></div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/users")} className="text-sm font-bold text-white px-4 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#1e3a5f" }}>Manage Users</button>
          <button onClick={load} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-bold text-emerald-800">All systems operational</span>
        <span className="text-xs text-emerald-600 ml-auto">{totalUsers} users registered</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Users} label="Total Users" value={totalUsers} color="bg-blue-50 text-blue-600" borderClr="border-blue-300" />
        <StatCard icon={GraduationCap} label="Students" value={stats.totalStudents || 0} color="bg-violet-50 text-violet-600" borderClr="border-violet-300" />
        <StatCard icon={Shield} label="Teachers" value={stats.totalTeachers || 0} color="bg-emerald-50 text-emerald-600" borderClr="border-emerald-300" />
        <StatCard icon={BookOpen} label="Classes" value={stats.totalClasses || 0} color="bg-amber-50 text-amber-600" borderClr="border-amber-300" />
        <StatCard icon={Award} label="Certificates" value={stats.certificates || 0} color="bg-teal-50 text-teal-600" borderClr="border-teal-300" />
        <StatCard icon={AlertTriangle} label="Banned" value={stats.banned || 0} color="bg-rose-50 text-rose-600" borderClr="border-rose-300" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:"Modules",v:stats.totalModules,icon:FileText,c:"text-indigo-600 bg-indigo-50"},{l:"Quizzes",v:stats.totalQuizzes,icon:Brain,c:"text-purple-600 bg-purple-50"},{l:"Videos",v:stats.totalVideos,icon:Tv,c:"text-blue-600 bg-blue-50"},{l:"Files",v:stats.totalFiles,icon:Download,c:"text-orange-600 bg-orange-50"}].map((x,i)=>(<div key={i} className="card-premium p-4 text-center"><div className={`w-8 h-8 rounded-lg ${x.c} flex items-center justify-center mx-auto mb-2`}><x.icon className="w-4 h-4"/></div><div className={`text-xl font-bold ${x.c.split(" ")[0]}`}>{x.v??"-"}</div><div className="text-xs text-gray-500 font-medium">{x.l}</div></div>))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card-premium p-5">
          <div className="flex justify-between items-center mb-4"><h2 className="text-base font-bold text-gray-900">Recent Users</h2><button onClick={()=>router.push("/admin/users")} className="text-xs font-bold" style={{color:"#1e3a5f"}}>View All</button></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-100"><th className="text-left pb-2 font-bold text-gray-500 text-xs">User</th><th className="text-left pb-2 font-bold text-gray-500 text-xs">Email</th><th className="text-left pb-2 font-bold text-gray-500 text-xs">Role</th><th className="text-left pb-2 font-bold text-gray-500 text-xs">Status</th></tr></thead><tbody>{recentUsers.map((u:any)=>(<tr key={u.id} className="border-b border-gray-50"><td className="py-2.5"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:"#1e3a5f"}}>{u.firstName?.[0]}{u.lastName?.[0]}</div><span className="font-semibold text-gray-900">{u.firstName} {u.lastName}</span></div></td><td className="py-2.5 text-gray-500 text-xs">{u.email}</td><td className="py-2.5"><Badge variant={u.role==="ADMIN"?"danger":u.role==="TEACHER"?"success":"info"}>{u.role}</Badge></td><td className="py-2.5">{u.isBanned==="true"?<Badge variant="danger">Banned</Badge>:<Badge variant="success">Active</Badge>}</td></tr>))}</tbody></table></div>
        </div>
        <div className="space-y-4">
          <div className="card-premium p-5"><h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2><div className="space-y-2">{[{l:"Manage Users",to:"/admin/users",c:"bg-blue-50 text-blue-700 border-blue-200"},{l:"Create Class",to:"/admin/classes",c:"bg-emerald-50 text-emerald-700 border-emerald-200"},{l:"View Certificates",to:"/admin/certificates",c:"bg-amber-50 text-amber-700 border-amber-200"},{l:"Platform Analytics",to:"/admin/analytics",c:"bg-violet-50 text-violet-700 border-violet-200"}].map((a,i)=>(<button key={i} onClick={()=>router.push(a.to)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold hover:opacity-80 ${a.c}`}>{a.l}<ChevronRight className="w-4 h-4 inline ml-1"/></button>))}</div></div>
        </div>
      </div>
    </div>
  );
}
