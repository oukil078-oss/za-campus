"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Brain, Award, Trophy, Target, Play, Bell, TrendingUp, ChevronRight, FileText, Star } from "lucide-react";
import { StatCard, Badge, Progress, Spinner } from "@/components/ui";

export default function StudentDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r=>r.json()),
      fetch("/api/classes").then(r=>r.json()),
      fetch("/api/certificates").then(r=>r.json()),
      fetch("/api/leaderboard").then(r=>r.json()),
      fetch("/api/notifications").then(r=>r.json()),
    ]).then(([me,cd,crd,lb,nf]) => {
      setUser(me.user); setClasses(cd.classes||[]); setCerts(crd.certificates||[]);
      setLeaderboard((lb.leaderboard||[]).slice(0,5)); setNotifications((nf.notifications||[]).slice(0,3));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg"/></div>;

  const totalModules = classes.reduce((s:number,c:any)=>s+(c._count?.modules||0),0);
  const nextClass = classes[0];
  const myRank = leaderboard.find((e:any)=>e.student?.user?.email===user?.email);

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-gray-900">Welcome back, <span style={{color:"#1e3a5f"}}>{user?.firstName}</span> 👋</h1><p className="text-gray-500 mt-1 text-sm">Track your learning journey and continue where you left off.</p></div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={BookOpen} label="Enrolled" value={classes.length} color="bg-blue-50 text-blue-600" borderClr="border-blue-300"/>
        <StatCard icon={Brain} label="Modules" value={totalModules} color="bg-violet-50 text-violet-600" borderClr="border-violet-300"/>
        <StatCard icon={Award} label="Certificates" value={certs.length} color="bg-amber-50 text-amber-600" borderClr="border-amber-300"/>
        <StatCard icon={Trophy} label="Your Rank" value={myRank?`#${myRank.rank}`:"—"} color="bg-rose-50 text-rose-600" borderClr="border-rose-300"/>
        <StatCard icon={TrendingUp} label="Avg Score" value="—" color="bg-emerald-50 text-emerald-600" borderClr="border-emerald-300"/>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {nextClass && (
            <div className="card-premium p-6 border-l-4 border-blue-400 bg-gradient-to-r from-blue-50/50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><Play className="w-6 h-6 text-blue-600"/></div>
                <div className="flex-1"><p className="text-xs font-bold text-blue-600 uppercase mb-1">Continue Learning</p><h3 className="text-lg font-bold text-gray-900">{nextClass.name}</h3><p className="text-xs text-gray-500">{nextClass._count?.modules||0} modules</p></div>
                <button onClick={()=>router.push("/student/classes/"+nextClass.id)} className="text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 flex-shrink-0" style={{background:"#2563eb"}}>Resume <ChevronRight className="w-4 h-4 inline ml-1"/></button>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-3"><h2 className="text-base font-bold text-gray-900">My Classes</h2><button onClick={()=>router.push("/student/classes")} className="text-xs font-bold" style={{color:"#1e3a5f"}}>View All</button></div>
            <div className="grid md:grid-cols-2 gap-3">
              {classes.slice(0,4).map((c:any)=>(
                <div key={c.id} onClick={()=>router.push("/student/classes/"+c.id)} className="card-premium p-4 cursor-pointer hover:border-[#1e3a5f] hover:shadow-md transition-all group">
                  <div className="flex justify-between mb-2"><Badge variant="info">{c.code}</Badge><ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f]"/></div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.name}</h3>
                  <Progress value={Math.floor(Math.random()*50+30)} size="sm"/>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2"><span className="flex items-center gap-1"><FileText className="w-3 h-3"/>{c._count?.modules||0} modules</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-premium p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500"/>Leaderboard</h2>
            {leaderboard.slice(0,5).map((e:any,i:number)=>(<div key={e.id} className={`flex items-center gap-2 p-2 rounded-lg ${e.student?.user?.email===user?.email?"bg-amber-50 border border-amber-200":""}`}><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i===0?"bg-amber-100 text-amber-700":i===1?"bg-gray-100 text-gray-600":"bg-gray-50 text-gray-500"}`}>{i+1}</div><span className="flex-1 text-sm font-semibold truncate">{e.student?.user?.firstName} {e.student?.user?.lastName}</span><span className="text-xs font-bold">{e.totalScore?.toFixed?.(0)||e.totalScore}%</span></div>))}
            <button onClick={()=>router.push("/student/leaderboard")} className="mt-2 text-xs font-bold w-full text-center py-1" style={{color:"#1e3a5f"}}>View Full Leaderboard</button>
          </div>

          <div className="card-premium p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-gray-500"/>Notifications</h2>
            {notifications.length===0?<p className="text-sm text-gray-400 text-center py-3">No notifications</p>:notifications.map((n:any,i:number)=>(<div key={i} className="p-2.5 rounded-lg bg-gray-50 mb-1.5"><p className="text-xs font-bold text-gray-900">{n.title}</p><p className="text-xs text-gray-500 line-clamp-2">{n.message}</p></div>))}
          </div>

          {certs.length>0&&<div className="card-premium p-5"><h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500"/>Certificates</h2>{certs.slice(0,2).map((c:any)=>(<div key={c.id} className="flex items-center gap-2 p-2 rounded-lg border border-amber-100 bg-amber-50/30 mb-2"><Award className="w-4 h-4 text-amber-600 flex-shrink-0"/><div className="min-w-0"><p className="text-xs font-bold truncate">{c.class?.name}</p><p className="text-xs text-gray-500">{c.score}/20</p></div></div>))}<button onClick={()=>router.push("/student/certificates")} className="text-xs font-bold" style={{color:"#1e3a5f"}}>View All</button></div>}
        </div>
      </div>
    </div>
  );
}
