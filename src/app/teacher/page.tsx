"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, FileText, Activity, Plus, Brain, BarChart3, ChevronRight } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]); const [user, setUser] = useState<any>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([fetch("/api/auth/me").then(r => r.json()), fetch("/api/classes").then(r => r.json())]).then(([me, cd]) => { setUser(me.user); setClasses(cd.classes || []); setLoading(false); }); }, []);
  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  const totalStudents = classes.reduce((s: number, c: any) => s + (c._count?.students || 0), 0);
  const totalModules = classes.reduce((s: number, c: any) => s + (c._count?.modules || 0), 0);
  const activeClasses = classes.filter((c: any) => c.isPublished === "true" || c.isPublished === true);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Instructor Portal</p>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Welcome, {user?.firstName} {user?.lastName}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, l: "My Classes", v: classes.length, c: "border-blue-200" },
          { icon: Users, l: "Total Students", v: totalStudents, c: "border-violet-200" },
          { icon: FileText, l: "Total Modules", v: totalModules, c: "border-emerald-200" },
          { icon: Activity, l: "Active Classes", v: activeClasses.length, c: "border-amber-200" },
        ].map((s, i) => (
          <div key={i} className={`card p-4 border-l-2 ${s.c}`}>
            <s.icon className="w-4 h-4 text-gray-400 mb-2" />
            <div className="text-xl font-bold text-gray-900">{s.v}</div>
            <div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">My Classes</h2>
          {classes.length === 0 ? (
            <div className="card p-8 text-center text-sm text-gray-400">No classes assigned. Contact an administrator.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {classes.map((c: any) => (
                <div key={c.id} onClick={() => router.push(`/teacher/classes/${c.id}`)} className="card p-4 cursor-pointer hover:border-gray-300 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-info">{c.code}</span>
                    <span className={`badge ${c.isPublished === "true" || c.isPublished === true ? "badge-success" : "badge-neutral"}`}>{c.isPublished === "true" || c.isPublished === true ? "Published" : "Draft"}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{c.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c._count?.students || 0} students</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {c._count?.modules || 0} modules</span>
                  </div>
                  <div className="mt-3 w-full h-1 rounded-full bg-gray-100"><div className="h-1 rounded-full" style={{ width: `${Math.min(100, (c._count?.modules || 0) * 15)}%`, background: "#1a2744" }} /></div>
                  <button onClick={(e) => { e.stopPropagation(); router.push(`/teacher/classes/${c.id}`); }} className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-900">Manage Content →</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 h-fit">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Actions</h2>
          <div className="space-y-1.5">
            {[
              { l: "View All Students", to: "/teacher/students", icon: Users },
              { l: "Manage Assessments", to: "/teacher/quizzes", icon: Brain },
              { l: "Class Insights", to: "/teacher", icon: BarChart3 },
            ].map((a, i) => (
              <button key={i} onClick={() => router.push(a.to)} className="w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-between">
                <span className="flex items-center gap-2"><a.icon className="w-3.5 h-3.5 text-gray-400" /> {a.l}</span>
                <ChevronRight className="w-3 h-3 text-gray-300" />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider mb-2">Summary</p>
            <p className="text-xs text-gray-500">{totalModules} modules across {classes.length} classes · {totalStudents} total students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
