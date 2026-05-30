"use client";
import { useEffect, useState } from "react";
import { Trophy, Medal, TrendingUp } from "lucide-react";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/leaderboard").then(r => r.json()).then(d => { setEntries(d.leaderboard || []); setLoading(false); }); }, []);
  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  const top3 = entries.slice(0, 3);
  const podiumStyles = [
    { emoji: "🥇", border: "border-amber-300", bg: "bg-amber-50/30" },
    { emoji: "🥈", border: "border-gray-200", bg: "bg-gray-50/30" },
    { emoji: "🥉", border: "border-orange-200", bg: "bg-orange-50/30" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Academic Standing</p>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-1">Rankings based on assessment performance across all courses</p>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {top3.map((entry, i) => (
            <div key={entry.id} className={`card p-6 text-center border-2 ${podiumStyles[i].border} ${podiumStyles[i].bg}`}>
              <div className="text-3xl mb-1.5">{podiumStyles[i].emoji}</div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-base font-bold mx-auto mb-2 shadow-sm" style={{ color: "#1a2744" }}>
                {entry.student?.user?.firstName?.[0]}{entry.student?.user?.lastName?.[0]}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{entry.student?.user?.firstName} {entry.student?.user?.lastName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{entry.class?.name}</p>
              <div className="mt-3 text-2xl font-bold" style={{ color: "#1a2744" }}>{entry.totalScore?.toFixed?.(0) || entry.totalScore}%</div>
              <span className="badge badge-info mt-1">Rank #{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Full Rankings */}
      <div className="card overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Full Rankings</h2>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No rankings available yet. Complete assessments to appear on the leaderboard.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead className="table-header"><tr><th className="w-16 text-center">Rank</th><th>Student</th><th className="hidden sm:table-cell">Class</th><th className="w-20 text-center">Score</th></tr></thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.id} className="table-row">
                    <td className="table-cell text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500"}`}>{i + 1}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold text-white" style={{ background: "#1a2744" }}>{entry.student?.user?.firstName?.[0]}{entry.student?.user?.lastName?.[0]}</div><span className="font-semibold text-gray-900">{entry.student?.user?.firstName} {entry.student?.user?.lastName}</span></div>
                    </td>
                    <td className="table-cell text-gray-500 hidden sm:table-cell text-xs">{entry.class?.name}</td>
                    <td className="table-cell text-center font-bold text-gray-900">{entry.totalScore?.toFixed?.(0) || entry.totalScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
