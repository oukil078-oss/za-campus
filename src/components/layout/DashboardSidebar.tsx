"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Users, BookOpen, Award, BarChart3, LogOut, Menu, Bell, Home, Brain, Trophy, Shield } from "lucide-react";

const links:Record<string,{href:string;label:string;icon:any}[]> = {
  ADMIN: [{href:"/admin",label:"Dashboard",icon:LayoutDashboard},{href:"/admin/users",label:"Users",icon:Users},{href:"/admin/classes",label:"Classes",icon:BookOpen},{href:"/admin/certificates",label:"Certificates",icon:Award},{href:"/admin/analytics",label:"Analytics",icon:BarChart3}],
  TEACHER: [{href:"/teacher",label:"Dashboard",icon:LayoutDashboard},{href:"/teacher/classes",label:"My Classes",icon:BookOpen},{href:"/teacher/quizzes",label:"Quizzes",icon:Brain},{href:"/teacher/students",label:"Students",icon:Users}],
  STUDENT: [{href:"/student",label:"Dashboard",icon:LayoutDashboard},{href:"/student/classes",label:"My Classes",icon:BookOpen},{href:"/student/quizzes",label:"Quizzes",icon:Brain},{href:"/student/certificates",label:"Certificates",icon:Award},{href:"/student/leaderboard",label:"Leaderboard",icon:Trophy}],
};

export default function DashboardSidebar({ children, role }: { children: React.ReactNode; role: string }) {
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const router = useRouter(); const pathname = usePathname();
  const navLinks = links[role] || [];

  useEffect(()=>{
    fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.user)setUser(d.user);else router.push("/login");}).catch(()=>router.push("/login"));
    fetch("/api/notifications").then(r=>r.json()).then(d=>{setNotifications(d.notifications?.slice(0,5)||[]);setUnread(d.unreadCount||0);}).catch(()=>{});
  },[]);

  const handleLogout = async () => { await fetch("/api/auth/logout",{method:"POST"}); router.push("/login"); };
  const roleColors:Record<string,string> = {ADMIN:"bg-red-100 text-red-700",TEACHER:"bg-emerald-100 text-emerald-700",STUDENT:"bg-violet-100 text-violet-700"};

  return (<div className="min-h-screen flex bg-gray-50">
    <aside className={`${collapsed?"w-[72px]":"w-64"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed inset-y-0 z-30`}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-white"/></div>
        {!collapsed&&<span className="text-lg font-bold text-primary">Za<span className="text-accent">-Campus</span></span>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(l=>{const active=pathname===l.href;return(<Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${active?"bg-primary/10 text-primary":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}><l.icon className="w-5 h-5 flex-shrink-0"/>{!collapsed&&l.label}</Link>)})}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><Home className="w-5 h-5 flex-shrink-0"/>{!collapsed&&"Public Site"}</Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"><LogOut className="w-5 h-5 flex-shrink-0"/>{!collapsed&&"Sign Out"}</button>
      </div>
    </aside>
    <div className={`flex-1 ${collapsed?"ml-[72px]":"ml-64"} transition-all`}>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button onClick={()=>setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Menu className="w-5 h-5"/></button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={()=>setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Bell className="w-5 h-5"/>{unread>0&&<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"/>}</button>
            {notifOpen&&<div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-40 animate-scale-in"><div className="px-4 py-3 border-b flex justify-between"><span className="text-sm font-semibold">Notifications</span><span className="text-xs text-gray-500">{unread} unread</span></div><div className="max-h-64 overflow-y-auto">{notifications.length===0?<p className="text-sm text-gray-500 text-center py-8">No notifications</p>:notifications.map((n:any)=>(<div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50"><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-gray-500 mt-0.5">{n.message}</p></div>))}</div></div>}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block"><p className="text-sm font-semibold">{user?`${user.firstName} ${user.lastName}`:"..."}</p><p className={`text-xs font-medium ${roleColors[role]} px-2 py-0.5 rounded-full inline-block`}>{role}</p></div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{user?user.firstName[0]+user.lastName[0]:"?"}</div>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  </div>);
}
