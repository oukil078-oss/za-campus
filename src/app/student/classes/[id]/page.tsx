"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Tv, FileText, Brain, Play, Download, ChevronRight, Trophy } from "lucide-react";
export default function P() {
  const params=useParams();const router=useRouter();const [cls,setCls]=useState<any>(null);const [expanded,setExpanded]=useState<string|null>(null);const [l,setL]=useState(true);const [vid,setVid]=useState<string|null>(null);
  useEffect(()=>{fetch("/api/classes/"+params.id).then(r=>r.json()).then(d=>{setCls(d.class);setL(false)});},[params.id]);
  if(l) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  if(!cls) return <div className="py-16 text-center text-gray-500">Not found</div>;
  return (<div className="space-y-6 animate-fade-in"><button onClick={()=>router.push("/student/classes")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"><ArrowLeft className="w-4 h-4"/>Back</button>
    <div className="card-premium p-6"><span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">{cls.code}</span><h1 className="text-2xl font-bold mt-2">{cls.name}</h1><p className="text-sm text-gray-500 mt-1">{cls.description}</p></div>
    {vid&&(<div className="card-premium overflow-hidden bg-black rounded-xl"><video src={vid} controls className="w-full max-h-[400px]" autoPlay/><button onClick={()=>setVid(null)} className="text-white text-xs px-4 py-2">Close</button></div>)}
    <h2 className="text-lg font-semibold">Course Modules</h2>
    <div className="space-y-3">{cls.modules?.map((mod:any,idx:number)=>(<div key={mod.id} className="card-premium overflow-hidden">
      <button onClick={()=>setExpanded(expanded===mod.id?null:mod.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">{idx+1}</div><div className="flex-1"><h3 className="font-medium">{mod.title}</h3><div className="flex items-center gap-3 text-xs text-gray-500 mt-1"><span className="flex items-center gap-1"><Tv className="w-3 h-3"/>{mod.videos?.length||0}</span><span className="flex items-center gap-1"><FileText className="w-3 h-3"/>{mod.files?.length||0}</span><span className="flex items-center gap-1"><Brain className="w-3 h-3"/>{mod.quizzes?.length||0}</span></div></div><ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded===mod.id?"rotate-90":""}`}/></button>
      {expanded===mod.id&&(<div className="border-t p-4 space-y-2 animate-fade-in">
        {mod.videos?.map((v:any)=>(<div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50"><Tv className="w-4 h-4 text-blue-600 flex-shrink-0"/><span className="flex-1 text-sm">{v.title}</span><button onClick={()=>setVid(v.url)} className="flex items-center gap-1 text-xs font-medium text-primary"><Play className="w-3 h-3"/>Watch</button></div>))}
        {mod.files?.map((f:any)=>(<div key={f.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50"><FileText className="w-4 h-4 text-emerald-600 flex-shrink-0"/><span className="flex-1 text-sm">{f.title}</span><a href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-primary"><Download className="w-3 h-3"/>Open</a></div>))}
        {mod.quizzes?.map((q:any)=>(<div key={q.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50"><Brain className="w-4 h-4 text-violet-600 flex-shrink-0"/><span className="flex-1 text-sm">{q.title} ({q._count.questions} qs)</span><button onClick={()=>router.push("/student/quizzes/"+q.id)} className="text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-lg">Take Quiz</button></div>))}
      </div>)}
    </div>))}</div>
    {cls.finalQuizzes?.map((fq:any)=>(<div key={fq.id} className="card-premium p-6 border-amber-200 bg-amber-50/20"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Trophy className="w-6 h-6 text-amber-600"/></div><div className="flex-1"><h3 className="font-semibold">{fq.title}</h3><p className="text-sm text-gray-500">{fq._count.questions} questions · Score 12/20 to pass and earn your certificate</p></div><button onClick={()=>router.push("/student/quizzes/final/"+fq.id)} className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl">Take Final Exam</button></div></div>))}
  </div>);
}
