"use client";
import { useEffect, useState } from "react";
import { Users, BookOpen, Brain, Award, TrendingUp, FileText, Tv, Download, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(d => { setStats(d); setLoading(false); }); }, []);
  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;
  const s = stats.stats || {};
  const tu = (s.totalStudents || 0) + (s.totalTeachers || 0) + (s.totalAdmins || 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Analytics</p><h1 className="text-xl font-bold text-gray-900 tracking-tight">Institutional Analytics</h1><p className="text-sm text-gray-500 mt-1">Comprehensive platform insights</p></div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[{icon:Users,l:"Users",v:tu},{icon:BookOpen,l:"Classes",v:s.totalClasses||0},{icon:Brain,l:"Assessments",v:s.totalQuizzes||0},{icon:Award,l:"Credentials",v:s.certificates||0},{icon:Tv,l:"Videos",v:s.totalVideos||0},{icon:Activity,l:"Restricted",v:s.banned||0}].map((m,i)=>(<div key={i} className="card p-4 text-center"><m.icon className="w-4 h-4 text-gray-400 mx-auto mb-1.5"/><div className="text-lg font-bold text-gray-900">{m.v}</div><div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{m.l}</div></div>))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">User Distribution</h2>
          <div className="space-y-4">
            {[{l:"Students",v:s.totalStudents||0,c:"#7c3aed"},{l:"Instructors",v:s.totalTeachers||0,c:"#059669"},{l:"Administrators",v:s.totalAdmins||0,c:"#dc2626"}].map(d=>(<div key={d.l}><div className="flex justify-between text-xs mb-1.5"><span className="font-bold text-gray-700">{d.l}</span><span className="font-bold text-gray-900">{d.v} <span className="text-gray-400">({tu>0?Math.round((d.v/tu)*100):0}%)</span></span></div><div className="w-full h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full transition-all duration-700" style={{width:`${tu>0?(d.v/tu)*100:0}%`,background:d.c}}/></div></div>))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Content Overview</h2>
          <div className="space-y-2.5">
            {[{l:"Classes",v:s.totalClasses||0,icon:BookOpen},{l:"Modules",v:s.totalModules||0,icon:FileText},{l:"Assessments",v:s.totalQuizzes||0,icon:Brain},{l:"Videos",v:s.totalVideos||0,icon:Tv},{l:"Files",v:s.totalFiles||0,icon:Download}].map(d=>(<div key={d.l} className="flex items-center justify-between p-2.5 rounded-md bg-gray-50"><div className="flex items-center gap-2.5"><d.icon className="w-3.5 h-3.5 text-gray-400"/><span className="text-xs font-semibold text-gray-700">{d.l}</span></div><span className="text-sm font-bold text-gray-900">{d.v}</span></div>))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:"Avg Students/Class",v:s.totalClasses>0?Math.round(s.totalStudents/s.totalClasses):0},{l:"Modules/Class",v:s.totalClasses>0?Math.round(s.totalModules/s.totalClasses):0},{l:"Quizzes/Module",v:s.totalModules>0?Math.round(s.totalQuizzes/s.totalModules):0},{l:"Platform Health",v:"Excellent"}].map(m=>(<div key={m.l} className="card p-4 text-center"><div className="text-lg font-bold" style={{color:"#1a2744"}}>{m.v}</div><div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider">{m.l}</div></div>))}
      </div>
    </div>
  );
}
