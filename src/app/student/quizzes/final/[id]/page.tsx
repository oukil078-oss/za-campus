"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock, ChevronLeft, ChevronRight, Shield } from "lucide-react";

export default function FinalExamPage() {
  const params = useParams(); const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null); const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false); const [result, setResult] = useState<any>(null);
  const [passed, setPassed] = useState(false); const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => { fetch("/api/final-quizzes/" + params.id).then(r => r.json()).then(d => { setQuiz(d.finalQuiz); setLoading(false); }); }, [params.id]);

  useEffect(() => {
    if (!quiz?.timeLimit || submitted) return;
    setTimeLeft(parseInt(quiz.timeLimit) * 60);
    const t = setInterval(() => { setTimeLeft((prev: number | null) => { if (prev === null || prev <= 1) { clearInterval(t); return 0; } return prev - 1; }); }, 1000);
    return () => clearInterval(t);
  }, [quiz, submitted]);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/final-quizzes/${params.id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    const data = await res.json();
    setResult(data.attempt); setPassed(data.passed); setSubmitted(true); setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;
  if (!quiz) return <div className="py-24 text-center text-gray-400">Examination not found.</div>;

  const questions = quiz.questions || [];
  const answeredCount = questions.filter((q: any) => answers[q.id]).length;

  /* ── Results ── */
  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
        <div className={`card p-8 text-center ${passed ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30"}`}>
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-emerald-100" : "bg-red-100"}`}>{passed ? <CheckCircle className="w-7 h-7 text-emerald-600" /> : <XCircle className="w-7 h-7 text-red-600" />}</div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{passed ? "Final Examination Passed" : "Examination Not Passed"}</h1>
          <p className="text-sm text-gray-500 mb-2">
            {passed ? `You have successfully completed this course with a score of ${result.score}/20.` : `Your score of ${result.score}/20 is below the passing threshold of 12/20. You may retake the examination.`}
          </p>
          <div className="flex justify-center gap-10 my-6"><div><div className="text-3xl font-bold text-gray-900">{result.score}/20</div><div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Final Grade</div></div><div className="w-px bg-gray-200" /><div><div className={`text-3xl font-bold ${passed ? "text-emerald-600" : "text-red-600"}`}>{result.percentage}%</div><div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Percentage</div></div></div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push(`/student/classes/${quiz.class.id}`)} className="btn-secondary !text-sm">Return to Course</button>
            {passed && <button onClick={() => router.push("/student/certificates")} className="btn-accent !text-sm"><Trophy className="w-4 h-4" /> View Credential</button>}
            {!passed && <button onClick={() => { setSubmitted(false); setResult(null); setAnswers({}); setCurrentQ(0); }} className="btn-primary !text-sm">Retake Examination</button>}
          </div>
        </div>
      </div>
    );
  }

  /* ── Exam View ── */
  const q = questions[currentQ];
  const opts: string[] = q ? JSON.parse(q.options) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Exam Header */}
      <div className="card p-5 border-t-2 border-amber-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <div><span className="badge badge-warning text-[0.65rem]">Final Examination</span><h1 className="text-base font-bold text-gray-900 mt-1 tracking-tight">{quiz.title}</h1></div>
          </div>
          {timeLeft !== null && <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><Clock className="w-4 h-4" />{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</div>}
        </div>
        <p className="text-xs text-gray-400 mt-1">Passing grade: <strong className="text-amber-700">12/20</strong> · {questions.length} questions</p>
        <div className="flex-1 h-1 rounded-full bg-gray-100 mt-3"><div className="h-1 rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%`, background: "#c4a747" }} /></div>
        <div className="flex gap-1.5 mt-3 flex-wrap">{questions.map((_: any, i: number) => (
          <button key={i} onClick={() => setCurrentQ(i)} className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${i === currentQ ? "text-white" : answers[questions[i].id] ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-50 text-gray-400 border border-gray-100"}`}
            style={i === currentQ ? { background: "#c4a747" } : {}}>{i + 1}</button>
        ))}</div>
      </div>

      {/* Question */}
      {q && (
        <div className="card p-6 border-l-2 border-amber-200">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Question {currentQ + 1} of {questions.length}</p>
          <p className="text-sm font-bold text-gray-900 mb-5">{q.questionText}</p>
          <div className="space-y-2">
            {opts.map((opt: string) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${answers[q.id] === opt ? "bg-amber-50/50 border-amber-300" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="w-4 h-4" style={{ accentColor: "#c4a747" }} />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="btn-secondary !text-xs !px-3 !py-2"><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
        <div className="flex-1" />
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary !text-xs !px-3 !py-2" style={{ background: "#c4a747", color: "#1a2744" }}>Next <ChevronRight className="w-3.5 h-3.5" /></button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn-accent !text-sm !px-6 !py-2.5 font-bold">{submitting ? "Submitting..." : "Submit Final Examination"}</button>
        )}
      </div>
    </div>
  );
}
