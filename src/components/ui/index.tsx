"use client";
import type { ReactNode } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return <Loader2 className={`${s} animate-spin`} style={{ color: "#1e3a5f" }} />;
}

export function PageLoading() {
  return <div className="flex flex-col items-center justify-center py-24 gap-3"><Spinner size="lg" /><p className="text-sm text-gray-500 font-medium">Loading...</p></div>;
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: { label: string; onClick: () => void } }) {
  return <div className="flex flex-col items-center justify-center py-16 px-4 text-center"><div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-gray-400" /></div><h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3><p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>{action && <button onClick={action.onClick} className="text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#1e3a5f" }}>{action.label}</button>}</div>;
}

export function StatCard({ icon: Icon, label, value, trend, color, borderClr }: { icon: any; label: string; value: string | number; trend?: string; color: string; borderClr: string }) {
  return <div className={`card-premium p-5 border-l-4 ${borderClr} hover:shadow-md transition-shadow`}><div className="flex items-start justify-between mb-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>{trend && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{trend}</span>}</div><div className="text-2xl font-bold text-gray-900">{value}</div><div className="text-xs text-gray-500 mt-1 font-medium">{label}</div></div>;
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "danger" | "warning" | "info" | "ghost" }) {
  const colors: Record<string, string> = { default: "bg-gray-100 text-gray-700", success: "bg-emerald-50 text-emerald-700", danger: "bg-red-50 text-red-700", warning: "bg-amber-50 text-amber-700", info: "bg-blue-50 text-blue-700", ghost: "bg-transparent text-gray-500 border border-gray-200" };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors[variant]}`}>{children}</span>;
}

export function Progress({ value = 0, color = "#1e3a5f", size = "md" }: { value: number; color?: string; size?: "sm" | "md" }) {
  const pct = Math.min(100, Math.max(0, value));
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return <div className={`w-full bg-gray-100 rounded-full ${h}`}><div className={`${h} rounded-full transition-all duration-500`} style={{ width: `${pct}%`, background: color }} /></div>;
}
