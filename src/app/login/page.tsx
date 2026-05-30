"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      const role = data.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "TEACHER") router.push("/teacher");
      else router.push("/student");
    } catch { setError("Network error"); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="relative z-10 text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background:"#c8a951"}}>
            <GraduationCap className="w-8 h-8" style={{color:"#0f2440"}} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Za<span style={{color:"#c8a951"}}>-Campus</span></h1>
          <p className="text-lg leading-relaxed" style={{color:"#cbd5e1"}}>Your complete university learning platform. Sign in to access your courses, quizzes, and certificates.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"#1e3a5f"}}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{color:"#1e3a5f"}}>Za<span style={{color:"#c8a951"}}>-Campus</span></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-600 mb-8">Enter your credentials to continue</p>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@zacampus.dz" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none text-sm font-medium" style={{color:"#0f172a",background:"#ffffff"}} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none text-sm font-medium" style={{color:"#0f172a",background:"#ffffff"}} />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-white" style={{background:"#1e3a5f"}}>
              {loading ? "Signing in..." : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
          <div className="mt-8 p-5 rounded-xl" style={{background:"#f1f5f9"}}>
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Demo Credentials</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800"><strong className="text-gray-900">Admin:</strong> admin@zacampus.dz / password123</p>
              <p className="text-gray-800"><strong className="text-gray-900">Teacher:</strong> dr.mansouri@zacampus.dz / password123</p>
              <p className="text-gray-800"><strong className="text-gray-900">Student:</strong> yasmine.boudiaf@zacampus.dz / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
