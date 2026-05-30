"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, FileText, Plus, Trash2, Tv, Brain, Play, Download } from "lucide-react";

export default function TeacherClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"modules"|"students">("modules");
  const [showModForm, setShowModForm] = useState(false);
  const [modForm, setModForm] = useState({ title: "", description: "", isPublished: true });
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showVideoForm, setShowVideoForm] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({ title: "", url: "", duration: "" });
  const [showFileForm, setShowFileForm] = useState<string | null>(null);
  const [fileForm, setFileForm] = useState({ title: "", url: "", fileType: "pdf" });

  const fetchClass = async () => {
    const r = await fetch("/api/classes/" + params.id);
    const d = await r.json();
    setCls(d.class);
    setLoading(false);
  };
  useEffect(() => { fetchClass(); }, [params.id]);

  const createModule = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/modules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...modForm, classId: params.id, orderIndex: cls?.modules?.length || 0 }) });
    setShowModForm(false);
    setModForm({ title: "", description: "", isPublished: true });
    fetchClass();
  };

  const deleteModule = async (id: string) => {
    if (!confirm("Delete this module and all its content?")) return;
    await fetch("/api/modules/" + id, { method: "DELETE" });
    fetchClass();
  };

  const addVideo = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...videoForm, moduleId, orderIndex: 0 }) });
    setShowVideoForm(null);
    setVideoForm({ title: "", url: "", duration: "" });
    fetchClass();
  };

  const addFile = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    await fetch("/api/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fileForm, moduleId, orderIndex: 0 }) });
    setShowFileForm(null);
    setFileForm({ title: "", url: "", fileType: "pdf" });
    fetchClass();
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" /></div>;
  if (!cls) return <div className="py-16 text-center text-gray-600">Class not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => router.push("/teacher")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="card-premium p-6">
        <div className="flex justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#1e3a5f15", color: "#1e3a5f" }}>{cls.code}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{cls.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{cls.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-3">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls._count?.students || 0} students</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {cls._count?.modules || 0} modules</span>
            </div>
          </div>
          <button onClick={() => setShowModForm(!showModForm)} className="flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#1e3a5f" }}>
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>

        {showModForm && (
          <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-3">Create New Module</h3>
            <form onSubmit={createModule} className="space-y-3">
              <input placeholder="Module Title" value={modForm.title} onChange={e => setModForm({ ...modForm, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium" style={{ color: "#0f172a" }} />
              <input placeholder="Short Description" value={modForm.description} onChange={e => setModForm({ ...modForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium" style={{ color: "#0f172a" }} />
              <div className="flex gap-3">
                <button type="submit" className="text-white px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1e3a5f" }}>Create Module</button>
                <button type="button" onClick={() => setShowModForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button onClick={() => setTab("modules")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${tab === "modules" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>Modules</button>
          <button onClick={() => setTab("students")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${tab === "students" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>Students ({cls._count?.students || 0})</button>
        </div>

        {tab === "modules" && (
          <div className="space-y-3">
            {cls.modules?.length === 0 && (
              <p className="text-center text-gray-500 py-8">No modules yet. Click &quot;Add Module&quot; to create your first module.</p>
            )}
            {cls.modules?.map((mod: any, idx: number) => (
              <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#1e3a5f15", color: "#1e3a5f" }}>{idx + 1}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                    <p className="text-xs text-gray-500">{mod.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      <span className="flex items-center gap-1"><Tv className="w-3 h-3" /> {mod.videos?.length || 0} videos</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {mod.files?.length || 0} files</span>
                      <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {mod.quizzes?.length || 0} quizzes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                      {expandedModule === mod.id ? "Collapse" : "Manage Content"}
                    </button>
                    <button onClick={() => deleteModule(mod.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Delete module">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedModule === mod.id && (
                  <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50 animate-fade-in">
                    {mod.videos?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Videos</h4>
                        <div className="space-y-2">
                          {mod.videos.map((v: any) => (
                            <div key={v.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                              <Tv className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="flex-1 text-sm text-gray-900 font-medium">{v.title}</span>
                              {v.duration && <span className="text-xs text-gray-500">{Math.floor(parseInt(v.duration)/60)}m</span>}
                              <a href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-[#1e3a5f] hover:underline"><Play className="w-3 h-3" /> View</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mod.files?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Files</h4>
                        <div className="space-y-2">
                          {mod.files.map((f: any) => (
                            <div key={f.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                              <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="flex-1 text-sm text-gray-900 font-medium">{f.title}</span>
                              <span className="text-xs text-gray-500 uppercase">{f.fileType}</span>
                              <a href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-[#1e3a5f] hover:underline"><Download className="w-3 h-3" /> Open</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                      <button onClick={() => { setShowVideoForm(mod.id); setShowFileForm(null); }} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                        <Tv className="w-3.5 h-3.5" /> Add Video
                      </button>
                      <button onClick={() => { setShowFileForm(mod.id); setShowVideoForm(null); }} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                        <FileText className="w-3.5 h-3.5" /> Add File
                      </button>
                    </div>

                    {showVideoForm === mod.id && (
                      <form onSubmit={(e) => addVideo(e, mod.id)} className="space-y-2 p-4 bg-blue-50/30 rounded-xl border border-blue-100 animate-scale-in">
                        <input placeholder="Video Title" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" style={{ color: "#0f172a" }} />
                        <input placeholder="Video URL" value={videoForm.url} onChange={e => setVideoForm({ ...videoForm, url: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" style={{ color: "#0f172a" }} />
                        <input placeholder="Duration (seconds)" value={videoForm.duration} onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" style={{ color: "#0f172a" }} />
                        <div className="flex gap-2">
                          <button type="submit" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: "#2563eb" }}>Save Video</button>
                          <button type="button" onClick={() => setShowVideoForm(null)} className="text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                        </div>
                      </form>
                    )}

                    {showFileForm === mod.id && (
                      <form onSubmit={(e) => addFile(e, mod.id)} className="space-y-2 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 animate-scale-in">
                        <input placeholder="File Title" value={fileForm.title} onChange={e => setFileForm({ ...fileForm, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" style={{ color: "#0f172a" }} />
                        <input placeholder="File URL" value={fileForm.url} onChange={e => setFileForm({ ...fileForm, url: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" style={{ color: "#0f172a" }} />
                        <div className="flex gap-2">
                          <button type="submit" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: "#059669" }}>Save File</button>
                          <button type="button" onClick={() => setShowFileForm(null)} className="text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "students" && (
          <div className="overflow-x-auto">
            {cls.students?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No students enrolled yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-bold text-gray-600">Name</th>
                    <th className="text-left py-3 font-bold text-gray-600">Email</th>
                    <th className="text-left py-3 font-bold text-gray-600">Student ID</th>
                  </tr>
                </thead>
                <tbody>
                  {cls.students?.map((s: any) => (
                    <tr key={s.student?.user?.id || s.id} className="border-b border-gray-100">
                      <td className="py-3 font-semibold text-gray-900">{s.student?.user?.firstName} {s.student?.user?.lastName}</td>
                      <td className="py-3 text-gray-600">{s.student?.user?.email}</td>
                      <td className="py-3 text-gray-500 text-xs">{s.student?.studentNumber || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
