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
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6"><GraduationCap className="w-8 h-8 text-gray-900" /></div>
          <h1 className="text-4xl font-bold text-white mb-4">Za<span className="text-accent">-Campus</span></h1>
          <p className="text-white/60 text-lg">Your complete university learning platform. Sign in to access your courses, quizzes, and certificates.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10"><div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white"/></div><span className="text-xl font-bold text-primary">Za<span className="text-accent">-Campus</span></span></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to continue</p>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@zacampus.dz" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm" /></div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50">{loading?"Signing in...":<><LogIn className="w-4 h-4"/>Sign In</>}</button>
          </form>
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Demo Credentials</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Admin:</strong> admin@zacampus.dz / password123</p>
              <p><strong>Teacher:</strong> dr.mansouri@zacampus.dz / password123</p>
              <p><strong>Student:</strong> yasmine.boudiaf@zacampus.dz / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
