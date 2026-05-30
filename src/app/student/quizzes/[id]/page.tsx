"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Brain, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function QuizPage() {
  const params = useParams(); const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null); const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false); const [result, setResult] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => { fetch("/api/quizzes/" + params.id).then(r => r.json()).then(d => { setQuiz(d.quiz); setLoading(false); }); }, [params.id]);

  useEffect(() => {
    if (!quiz?.timeLimit || submitted) return;
    setTimeLeft(parseInt(quiz.timeLimit) * 60);
    const t = setInterval(() => { setTimeLeft((prev: number | null) => { if (prev === null || prev <= 1) { clearInterval(t); return 0; } return prev - 1; }); }, 1000);
    return () => clearInterval(t);
  }, [quiz, submitted]);

  const submit = async () => {
    if (submitting) return;
    const unanswered = quiz.questions.filter((q: any) => !answers[q.id]);
    if (unanswered.length > 0 && !confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) return;
    setSubmitting(true);
    const res = await fetch(`/api/quizzes/${params.id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    const data = await res.json();
    setResult(data.attempt); setDetails(data.results || []); setSubmitted(true); setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;
  if (!quiz) return <div className="py-24 text-center text-gray-400">Assessment not found.</div>;

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q: any) => answers[q.id]).length;

  /* ── Results View ── */
  if (submitted && result) {
    const passed = result.isPassed;
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
        <div className={`card p-8 text-center ${passed ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30"}`}>
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-emerald-100" : "bg-red-100"}`}>
            {passed ? <CheckCircle className="w-7 h-7 text-emerald-600" /> : <XCircle className="w-7 h-7 text-red-600" />}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{passed ? "Assessment Passed" : "Assessment Not Passed"}</h1>
          <p className="text-sm text-gray-500 mb-6">{passed ? "You have demonstrated proficiency in this module." : "Your score did not meet the passing threshold. Please review and attempt again."}</p>
          <div className="flex justify-center gap-10 mb-6">
            <div><div className="text-3xl font-bold text-gray-900">{result.score}/{result.totalPoints}</div><div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Score</div></div>
            <div className="w-px bg-gray-200" />
            <div><div className={`text-3xl font-bold ${passed ? "text-emerald-600" : "text-red-600"}`}>{result.percentage}%</div><div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Grade</div></div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/student/classes/" + quiz.module.classId)} className="btn-secondary !text-sm">Return to Course</button>
            {!passed && <button onClick={() => { setSubmitted(false); setResult(null); setAnswers({}); }} className="btn-primary !text-sm">Retake Assessment</button>}
          </div>
        </div>

        {/* Question Review */}
        <div className="card p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Question Review</h2>
          <div className="space-y-3">
            {details.map((d: any, i: number) => (
              <div key={i} className={`p-4 rounded-lg border ${d.isCorrect ? "border-emerald-100 bg-emerald-50/20" : "border-red-100 bg-red-50/20"}`}>
                <div className="flex items-start gap-2.5">
                  {d.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{i + 1}. {d.questionText}</p>
                    <p className="text-xs text-gray-500">Your answer: <span className={d.isCorrect ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>{d.yourAnswer || "(no answer)"}</span></p>
                    {!d.isCorrect && <p className="text-xs text-gray-500 mt-0.5">Correct: <span className="text-emerald-600 font-semibold">{d.correctAnswer}</span></p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz Taking View ── */
  const q = questions[currentQ];
  const opts: string[] = q ? JSON.parse(q.options) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Quiz Header */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">{quiz.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{totalQuestions} questions · Passing: {quiz.passingScore}%</p>
          </div>
          {timeLeft !== null && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <Clock className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1 rounded-full bg-gray-100">
            <div className="h-1 rounded-full transition-all" style={{ width: `${(answeredCount / totalQuestions) * 100}%`, background: "#1a2744" }} />
          </div>
          <span className="text-xs font-medium text-gray-400">{answeredCount}/{totalQuestions} answered</span>
        </div>
        {/* Question dots */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {questions.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrentQ(i)} className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${i === currentQ ? "text-white" : answers[questions[i].id] ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-50 text-gray-400 border border-gray-100"}`}
              style={i === currentQ ? { background: "#1a2744" } : {}}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      {q && (
        <div className="card p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Question {currentQ + 1} of {totalQuestions}</p>
          <p className="text-sm font-bold text-gray-900 mb-5">{q.questionText}</p>
          <div className="space-y-2">
            {opts.map((opt: string) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${answers[q.id] === opt ? "bg-[#1a2744]/5 border-[#1a2744]" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="w-4 h-4" style={{ accentColor: "#1a2744" }} />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-300 mt-3">{q.points} point{q.points > 1 ? "s" : ""}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="btn-secondary !text-xs !px-3 !py-2" disabled-aria-disabled>
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>
        <div className="flex-1" />
        {currentQ < totalQuestions - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary !text-xs !px-3 !py-2">Next <ChevronRight className="w-3.5 h-3.5" /></button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn-accent !text-xs !px-5 !py-2 font-bold">
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        )}
      </div>

      {/* Submit hint */}
      {answeredCount === totalQuestions && currentQ === totalQuestions - 1 && (
        <div className="text-center text-xs text-emerald-600 font-medium">All questions answered — ready to submit.</div>
      )}
    </div>
  );
}
