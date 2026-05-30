"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, ChevronRight, Users, FileText } from "lucide-react";

export default function StudentClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/classes").then(r => r.json()).then(d => { setClasses(d.classes || []); setLoading(false); }); }, []);
  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Courses</p><h1 className="text-xl font-bold text-gray-900 tracking-tight">My Courses</h1><p className="text-sm text-gray-500 mt-1">{classes.length} course{classes.length !== 1 ? "s" : ""} enrolled</p></div>
      {classes.length === 0 ? (
        <div className="card p-12 text-center"><BookMarked className="w-8 h-8 text-gray-300 mx-auto mb-3" /><h3 className="text-base font-semibold text-gray-700 mb-1">No Courses Yet</h3><p className="text-sm text-gray-400">Contact your administrator to enroll in courses.</p></div>
      ) : (
        <div className="space-y-3">
          {classes.map((c: any) => (
            <div key={c.id} onClick={() => router.push(`/student/classes/${c.id}`)} className="card p-5 cursor-pointer hover:border-gray-300 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5"><span className="badge badge-info">{c.code}</span><span className="badge badge-success">Active</span></div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description || c.category}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c._count?.students || 0} students</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {c._count?.modules || 0} modules</span>
                  </div>
                  <div className="mt-3 w-full h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 50 + 25)}%`, background: "#1a2744" }} /></div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
