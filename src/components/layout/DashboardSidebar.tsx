"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Users, BookOpen, Award, BarChart3, LogOut, Menu, Bell, Home, Brain, Trophy, BookMarked, ScrollText, Search, User, X } from "lucide-react";

const navConfig: Record<string, { href: string; label: string; icon: any }[]> = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/classes", label: "Classes", icon: BookOpen },
    { href: "/admin/certificates", label: "Credentials", icon: Award },
    { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
  TEACHER: [
    { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/classes", label: "My Classes", icon: BookOpen },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/quizzes", label: "Assessments", icon: Brain },
  ],
  STUDENT: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/classes", label: "My Courses", icon: BookMarked },
    { href: "/student/leaderboard", label: "Standings", icon: Trophy },
    { href: "/student/certificates", label: "Credentials", icon: Award },
  ],
};

export default function DashboardSidebar({ children, role }: { children: React.ReactNode; role: string }) {
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter(); const pathname = usePathname();
  const links = navConfig[role] || [];

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); else router.push("/login"); });
    fetch("/api/notifications").then(r => r.json()).then(d => { setNotifications(d.notifications?.slice(0, 5) || []); setUnread(d.unreadCount || 0); });
  }, []);

  const handleSearch = async () => {
    if (searchQ.length < 2) return;
    const r = await fetch(`/api/search?q=${encodeURIComponent(searchQ)}`);
    const d = await r.json();
    setSearchResults(d.results || []);
    setSearchOpen(true);
  };

  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); };
  const roleStr = role === "ADMIN" ? "Administrator" : role === "TEACHER" ? "Instructor" : "Student";

  const sidebar = (
    <aside className={`${collapsed ? "w-[68px]" : "w-60"} sidebar flex flex-col transition-all duration-300 fixed inset-y-0 z-30`}>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#1a2744" }}>
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="text-base font-bold tracking-tight" style={{ color: "#1a2744" }}>Za<span style={{ color: "#c4a747" }}>-Campus</span></span>}
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {links.map(l => {
          const active = pathname === l.href || (l.href !== `/${role.toLowerCase()}` && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href}
              className={`sidebar-link flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${active ? "active" : ""}`}>
              <l.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#c4a747]" : ""}`} />
              {!collapsed && l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 px-2.5 py-2.5 space-y-0.5">
        <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"><User className="w-4 h-4 flex-shrink-0" />{!collapsed && "Profile"}</Link>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"><Home className="w-4 h-4 flex-shrink-0" />{!collapsed && "Home"}</Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"><LogOut className="w-4 h-4 flex-shrink-0" />{!collapsed && "Sign Out"}</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#fafaf9" }}>
      <div className="hidden lg:block fixed inset-y-0 z-30">{sidebar}</div>
      <div className={`flex-1 ${collapsed ? "lg:ml-[68px]" : "lg:ml-60"} transition-all`}>
        <header className="topbar sticky top-0 z-20 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-1.5 rounded-md hover:bg-gray-100 text-gray-500"><Menu className="w-4 h-4" /></button>
            {/* Search */}
            <div className="relative hidden sm:block">
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Search..." className="w-48 text-xs pl-8 pr-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:w-64 transition-all" style={{ color: "#1a1a1a" }} />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              {searchOpen && (
                <div className="absolute top-full mt-1 left-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto animate-scale-in">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100"><span className="text-xs font-bold text-gray-900">Search Results</span><button onClick={() => { setSearchOpen(false); setSearchQ(""); }} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button></div>
                  {searchResults.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">No results</p> : searchResults.map((r: any, i: number) => (
                    <div key={i} className="px-3 py-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => { setSearchOpen(false); if (r.type === "class") router.push(`/student/classes/${r.id}`); }}>
                      <p className="text-xs font-semibold text-gray-900">{r.name || r.title || r.firstName + " " + r.lastName}</p>
                      <p className="text-[0.65rem] text-gray-400">{r.type?.toUpperCase()}{r.type === "user" ? ` · ${r.email}` : r.type === "class" ? ` · ${r.code}` : ""}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">{roleStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-md hover:bg-gray-100 text-gray-500"><Bell className="w-4 h-4" />{unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />}</button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-80 overflow-y-auto animate-scale-in">
                  <div className="sticky top-0 bg-white px-4 py-2.5 border-b border-gray-100 flex justify-between items-center"><span className="text-xs font-bold text-gray-900">Notifications</span><span className="text-xs text-gray-400">{unread} new</span></div>
                  {notifications.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">No notifications</p> : notifications.map((n: any) => (
                    <div key={n.id} className="px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"><p className="text-xs font-semibold text-gray-900">{n.title}</p><p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p></div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/profile" className="flex items-center gap-2.5 pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block"><p className="text-xs font-semibold text-gray-900 leading-tight">{user ? `${user.firstName} ${user.lastName}` : "..."}</p><p className="text-[0.65rem] text-gray-400 font-medium uppercase tracking-wider">{role}</p></div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1a2744" }}>{user ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "") : "?"}</div>
            </Link>
          </div>
        </header>
        <main className="p-5 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
