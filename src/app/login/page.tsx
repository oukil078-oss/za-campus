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
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      const r = data.user.role;
      if (r === "ADMIN") router.push("/admin"); else if (r === "TEACHER") router.push("/teacher"); else router.push("/student");
    } catch { setError("Network error. Please try again."); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 hero relative items-center justify-center p-10">
        <div className="relative z-10 text-center max-w-xs">
          <div className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-5" style={{ background: "#c4a747" }}>
            <GraduationCap className="w-6 h-6" style={{ color: "#1a2744" }} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Za<span style={{ color: "#c4a747" }}>-Campus</span></h1>
          <p className="text-sm text-white/50 leading-relaxed">Sign in to access your courses, assessments, and academic records.</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/80 to-transparent" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">{error}</div>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@zacampus.dz"
                className="w-full px-3.5 py-2.5 rounded-md border border-gray-200 focus:border-gray-400 text-sm font-medium transition-colors bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-md border border-gray-200 focus:border-gray-400 text-sm font-medium transition-colors bg-white" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5 justify-center">
              {loading ? "Signing in..." : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-md" style={{ background: "#f5f5f4" }}>
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <p><strong className="text-gray-900">Admin:</strong> admin@zacampus.dz / password123</p>
              <p><strong className="text-gray-900">Instructor:</strong> dr.mansouri@zacampus.dz / password123</p>
              <p><strong className="text-gray-900">Student:</strong> yasmine.boudiaf@zacampus.dz / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
