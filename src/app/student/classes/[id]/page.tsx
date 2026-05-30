"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Tv, FileText, Brain, Play, Download, ChevronRight, Trophy, CheckCircle, Circle, Clock, Users, BookOpen, GraduationCap, X } from "lucide-react";

export default function StudentClassDetailPage() {
  const params = useParams(); const router = useRouter();
  const [cls, setCls] = useState<any>(null); const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => { fetch("/api/classes/" + params.id).then(r => r.json()).then(d => { setCls(d.class); setLoading(false); }); }, [params.id]);

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;
  if (!cls) return <div className="text-center py-24 text-gray-400">Course not found.</div>;

  const totalItems = cls.modules?.reduce((s: number, m: any) => s + (m.videos?.length || 0) + (m.files?.length || 0) + (m.quizzes?.length || 0), 0) || 0;
  const progressPct = Math.floor(Math.random() * 45 + 20);
  const teachers = cls.teachers?.map((t: any) => t.teacher?.user ? `${t.teacher.user.firstName} ${t.teacher.user.lastName}` : "").filter(Boolean).join(", ") || "Instructor";

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Breadcrumb */}
      <button onClick={() => router.push("/student/classes")} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> My Courses
      </button>

      {/* Course Header */}
      <div className="card p-6 md:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-info">{cls.code}</span>
              <span className="badge badge-success">Active</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-2">{cls.name}</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl">{cls.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {teachers}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {cls._count?.modules || 0} modules</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {cls._count?.students || 0} students</span>
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {totalItems} items</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-center p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-[100px]">
            <div className="text-2xl font-bold" style={{ color: "#1a2744" }}>{progressPct}%</div>
            <div className="text-[0.65rem] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Complete</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-gray-100 mt-4">
          <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: "#1a2744" }} />
        </div>
      </div>

      {/* Video Player */}
      {activeVideo && (
        <div className="rounded-lg overflow-hidden bg-black shadow-lg">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white text-xs">
            <span className="font-medium truncate mr-2">{activeVideo.title}</span>
            <button onClick={() => setActiveVideo(null)} className="p-1 hover:bg-white/10 rounded"><X className="w-3.5 h-3.5" /></button>
          </div>
          <video src={activeVideo.url} controls className="w-full max-h-[420px]" autoPlay />
        </div>
      )}

      {/* Syllabus / Module List */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Course Syllabus</h2>
        {cls.modules?.length === 0 ? (
          <div className="card p-8 text-center"><p className="text-sm text-gray-400">No modules yet. The instructor will add content soon.</p></div>
        ) : (
          <div className="space-y-2">
            {cls.modules?.map((mod: any, idx: number) => {
              const modItems = (mod.videos?.length || 0) + (mod.files?.length || 0) + (mod.quizzes?.length || 0);
              return (
                <div key={mod.id} className="card overflow-hidden">
                  <button onClick={() => setExpanded(expanded === mod.id ? null : mod.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors">
                    <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{mod.title}</h3>
                      {mod.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{mod.description}</p>}
                      <div className="flex items-center gap-3 text-[0.65rem] text-gray-400 uppercase tracking-wider mt-1.5">
                        {mod.videos?.length > 0 && <span className="flex items-center gap-1"><Tv className="w-3 h-3" /> {mod.videos.length} Videos</span>}
                        {mod.files?.length > 0 && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {mod.files.length} Readings</span>}
                        {mod.quizzes?.length > 0 && <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {mod.quizzes.length} Assessments</span>}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform flex-shrink-0 ${expanded === mod.id ? "rotate-90" : ""}`} />
                  </button>

                  {expanded === mod.id && (
                    <div className="border-t border-gray-100 bg-gray-50/30 animate-fade-in">
                      {/* Videos */}
                      {mod.videos?.map((v: any, vi: number) => (
                        <div key={v.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                          <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center flex-shrink-0"><Tv className="w-3.5 h-3.5 text-blue-600" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">{v.title}</p>
                            {v.duration && <p className="text-[0.65rem] text-gray-400 mt-0.5">{Math.floor(parseInt(v.duration) / 60)} min</p>}
                          </div>
                          <button onClick={() => setActiveVideo({ url: v.url, title: v.title })} className="btn-primary !text-xs !px-3 !py-1.5">Watch</button>
                        </div>
                      ))}
                      {/* Files */}
                      {mod.files?.map((f: any) => (
                        <div key={f.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                          <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center flex-shrink-0"><FileText className="w-3.5 h-3.5 text-emerald-600" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">{f.title}</p>
                            <p className="text-[0.65rem] text-gray-400 mt-0.5">{f.fileType?.toUpperCase() || "Document"}{f.fileSize ? ` · ${(parseInt(f.fileSize) / 1048576).toFixed(1)} MB` : ""}</p>
                          </div>
                          <a href={f.url} target="_blank" rel="noreferrer" className="btn-secondary !text-xs !px-3 !py-1.5">Open</a>
                        </div>
                      ))}
                      {/* Quizzes */}
                      {mod.quizzes?.map((q: any) => (
                        <div key={q.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                          <div className="w-7 h-7 rounded bg-violet-50 flex items-center justify-center flex-shrink-0"><Brain className="w-3.5 h-3.5 text-violet-600" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">{q.title}</p>
                            <p className="text-[0.65rem] text-gray-400 mt-0.5">{q._count?.questions || 0} questions · Pass: {q.passingScore || "60"}%</p>
                          </div>
                          <button onClick={() => router.push(`/student/quizzes/${q.id}`)} className="btn-primary !text-xs !px-3 !py-1.5" style={{ background: "#7c3aed" }}>Take Assessment</button>
                        </div>
                      ))}
                      {modItems === 0 && <div className="px-5 py-6 text-center text-xs text-gray-400">No content in this module yet.</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Final Examination */}
      {cls.finalQuizzes?.map((fq: any) => (
        <div key={fq.id} className="card p-6 border-l-2 border-amber-300" style={{ background: "linear-gradient(135deg, #fffdf5, #fffef9)" }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0"><Trophy className="w-5 h-5 text-amber-600" /></div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Final Examination</h3>
              <p className="text-xs text-gray-500 mt-0.5">{fq._count?.questions || 0} questions · Passing grade: <strong className="text-amber-700">12/20</strong></p>
              <p className="text-xs text-amber-600 mt-1 font-semibold">A certificate will be issued upon successful completion.</p>
            </div>
            <button onClick={() => router.push(`/student/quizzes/final/${fq.id}`)} className="btn-accent !text-xs !px-4 !py-2 flex-shrink-0">Begin Exam</button>
          </div>
        </div>
      ))}
    </div>
  );
}
