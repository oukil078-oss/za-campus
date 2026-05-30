"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, Award, Trophy, TrendingUp, Play, Clock, Bell, ChevronRight, CheckCircle } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/classes").then(r => r.json()),
      fetch("/api/certificates").then(r => r.json()),
      fetch("/api/leaderboard").then(r => r.json()),
    ]).then(([me, cd, crd, lb]) => {
      setUser(me.user); setClasses(cd.classes || []); setCerts(crd.certificates || []);
      setLeaderboard((lb.leaderboard || []).slice(0, 5)); setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  const totalModules = classes.reduce((s: number, c: any) => s + (c._count?.modules || 0), 0);
  const myRank = leaderboard.find((e: any) => e.student?.user?.email === user?.email);
  const nextClass = classes[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Welcome */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Student Portal</p>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Welcome, <span style={{ color: "#1a2744" }}>{user?.firstName} {user?.lastName}</span>
        </h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookMarked, l: "Enrolled Courses", v: classes.length },
          { icon: CheckCircle, l: "Total Modules", v: totalModules },
          { icon: Award, l: "Credentials", v: certs.length },
          { icon: Trophy, l: "Current Rank", v: myRank ? `#${myRank.rank}` : "—" },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.l}</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning + Courses */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Continue Learning */}
          {nextClass && (
            <div className="card p-5 border-l-2 border-blue-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0"><Play className="w-4 h-4 text-blue-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Continue Learning</p>
                <h3 className="text-sm font-bold text-gray-900 truncate">{nextClass.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{nextClass.code} · {nextClass._count?.modules || 0} modules</p>
              </div>
              <button onClick={() => router.push(`/student/classes/${nextClass.id}`)} className="btn-primary !text-xs !px-3 !py-1.5 flex-shrink-0">Resume</button>
            </div>
          )}

          {/* Course Grid */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">My Courses</h2>
              <button onClick={() => router.push("/student/classes")} className="text-xs font-semibold text-gray-500 hover:text-gray-900">View All</button>
            </div>
            {classes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No courses enrolled. Contact your administrator.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {classes.map((c: any) => (
                  <div key={c.id} onClick={() => router.push(`/student/classes/${c.id}`)} className="card p-4 cursor-pointer hover:border-gray-300 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-info">{c.code}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{c.name}</h3>
                    <div className="w-full h-1 rounded-full bg-gray-100 mb-2">
                      <div className="h-1 rounded-full" style={{ width: `${Math.floor(Math.random() * 50 + 25)}%`, background: "#1a2744" }} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{c._count?.modules || 0} modules</span>
                      <span>·</span>
                      <span>{c.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <div className="card p-4">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-amber-500" />Standings</h2>
            {leaderboard.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">No rankings yet</p> : (
              <div className="space-y-1.5">
                {leaderboard.map((e: any, i: number) => (
                  <div key={e.id} className={`flex items-center gap-2 p-1.5 rounded text-xs ${e.student?.user?.email === user?.email ? "bg-amber-50" : ""}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                    <span className="flex-1 font-medium truncate">{e.student?.user?.firstName} {e.student?.user?.lastName}</span>
                    <span className="font-bold text-gray-700">{e.totalScore?.toFixed?.(0) || e.totalScore}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Credentials */}
          {certs.length > 0 && (
            <div className="card p-4">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2"><Award className="w-3.5 h-3.5 text-amber-500" />Credentials</h2>
              {certs.slice(0, 2).map((c: any) => (
                <div key={c.id} className="flex items-center gap-2 p-1.5 rounded text-xs mb-1.5 border border-amber-100 bg-amber-50/30">
                  <Award className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{c.class?.name}</p><p className="text-gray-400">{c.score}/20</p></div>
                </div>
              ))}
              <button onClick={() => router.push("/student/certificates")} className="text-xs font-semibold text-gray-500 hover:text-gray-900 mt-1">View All →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
