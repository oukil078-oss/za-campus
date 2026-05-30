"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, GraduationCap, Calendar, Shield, BookOpen, Award, Clock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user); setLoading(false); }); }, []);

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) { router.push("/login"); return null; }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "");
  const roleStr = user.role === "ADMIN" ? "Administrator" : user.role === "TEACHER" ? "Instructor" : "Student";
  const roleSrc = user.role === "ADMIN" ? "/admin" : user.role === "TEACHER" ? "/teacher" : "/student";

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => router.push(roleSrc)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">← Back to Dashboard</button>

      <div className="card p-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-sm" style={{ background: "#1a2744" }}>{initials}</div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{fullName}</h1>
        <p className="text-sm text-gray-400 mt-1">{roleStr}</p>
      </div>

      <div className="card p-6">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Account Information</h2>
        <div className="space-y-3">
          {[
            { icon: User, l: "Full Name", v: fullName },
            { icon: Mail, l: "Email", v: user.email },
            { icon: GraduationCap, l: "Role", v: roleStr },
            { icon: Calendar, l: "Member Since", v: new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long" }) },
            ...(user.student ? [{ icon: BookOpen, l: "Student ID", v: user.student.studentNumber }] : []),
            ...(user.teacher ? [{ icon: Shield, l: "Employee ID", v: user.teacher.employeeId }, { icon: BookOpen, l: "Department", v: user.teacher.department || "—" }] : []),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
              <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0"><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">{item.l}</p><p className="text-sm font-semibold text-gray-900">{item.v}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Account Status</h2>
        <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-emerald-700">Active</span>
          <span className="text-xs text-emerald-600 ml-auto">Good standing</span>
        </div>
      </div>
    </div>
  );
}
