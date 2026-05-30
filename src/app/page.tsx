"use client";
import Link from "next/link";
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Shield, Brain, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf9", color: "#1a1a1a" }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#1a2744" }}><GraduationCap className="w-3.5 h-3.5 text-white" /></div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "#1a2744" }}>Za<span style={{ color: "#c4a747" }}>-Campus</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-primary text-sm !px-4 !py-2">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-5 text-center hero">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-white/15 uppercase tracking-wider">Higher Education Platform</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
            A Learning Platform<br />Built for <span style={{ color: "#c4a747" }}>Serious Institutions</span>
          </h1>
          <p className="text-base text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
            Za-Campus provides the infrastructure for rigorous academic programs — courses, assessments, credentials, and analytics in one unified system.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login" className="btn-accent !px-6 !py-2.5 !text-base">Enter Platform <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/about" className="btn-secondary !text-white !border-white/20 hover:!bg-white/10 !px-6 !py-2.5">Learn More</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-lg mx-auto">
            {[["5,000+", "Students"], ["50+", "Courses"], ["98%", "Completion"], ["24/7", "Access"]].map(s => (
              <div key={s[0]} className="text-center"><div className="text-xl font-bold text-white">{s[0]}</div><div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s[1]}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Platform Pillars</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Designed for Academic Excellence</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, t: "Course Management", d: "Structured modules, video lectures, resources, and assessments organized for serious study.", c: "border-blue-100" },
              { icon: Brain, t: "Assessment Engine", d: "Timed quizzes, auto-grading, detailed feedback, and final examinations with certification.", c: "border-violet-100" },
              { icon: Shield, t: "Institutional Control", d: "Role-based access, audit trails, and administrative oversight for academic governance.", c: "border-emerald-100" },
              { icon: Award, t: "Verified Credentials", d: "Professional certificates issued upon successful completion with unique verification IDs.", c: "border-amber-100" },
            ].map((f, i) => (
              <div key={i} className={`card p-6 border-l-2 ${f.c}`}>
                <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4" style={{ background: "#f3f4f6", color: "#1a2744" }}><f.icon className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-tight">{f.t}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-20 px-5" style={{ background: "#f5f5f4" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Roles</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Built for Every Academic Role</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, r: "Administrators", items: ["User lifecycle management", "Class & curriculum oversight", "Institutional analytics"] },
              { icon: BookOpen, r: "Instructors", items: ["Course content creation", "Student progress monitoring", "Assessment management"] },
              { icon: GraduationCap, r: "Students", items: ["Structured course access", "Interactive assessments", "Verifiable credentials"] },
            ].map((c, i) => (
              <div key={i} className="card p-6 bg-white">
                <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4" style={{ background: "#1a2744" }}><c.icon className="w-4 h-4 text-white" /></div>
                <h3 className="text-base font-bold text-gray-900 mb-3 tracking-tight">{c.r}</h3>
                <ul className="space-y-2">
                  {c.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-[#c4a747] flex-shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center hero">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">Ready to Elevate Your Institution?</h2>
          <p className="text-white/60 mb-8">Join leading academic programs already using Za-Campus.</p>
          <Link href="/login" className="btn-accent !px-8 !py-3 !text-base font-bold">Get Started <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Za-Campus. An academic technology platform.
        </div>
      </footer>
    </div>
  );
}
