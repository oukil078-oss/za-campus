"use client";
import { useEffect, useState } from "react";
import { Award, Download, Shield, CheckCircle, ExternalLink } from "lucide-react";

export default function StudentCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/certificates").then(r => r.json()).then(d => { setCerts(d.certificates || []); setLoading(false); }); }, []);

  const download = async (cert: any) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setDrawColor(196, 167, 71); doc.setLineWidth(2.5); doc.rect(6, 6, 285, 198);
    doc.setLineWidth(0.3); doc.rect(10, 10, 277, 190);
    doc.setFont("helvetica", "bold"); doc.setFontSize(34); doc.setTextColor(26, 39, 68);
    doc.text("Za-Campus University", 148, 35, { align: "center" });
    doc.setFontSize(14); doc.setTextColor(100, 100, 100);
    doc.text("Certificate of Completion", 148, 50, { align: "center" });
    doc.setDrawColor(196, 167, 71); doc.setLineWidth(0.5); doc.line(60, 56, 236, 56);
    doc.setFontSize(28); doc.setTextColor(26, 39, 68);
    doc.text(`${cert.student?.firstName || ""} ${cert.student?.lastName || ""}`, 148, 80, { align: "center" });
    doc.setFontSize(14); doc.setTextColor(80, 80, 80);
    doc.text("has successfully completed the course", 148, 95, { align: "center" });
    doc.setFontSize(20); doc.setTextColor(196, 167, 71);
    doc.text(cert.class?.name || "Course", 148, 115, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(100, 100, 100);
    doc.text(`Final Grade: ${cert.score}/${cert.maxScore}    |    ${new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 148, 140, { align: "center" });
    doc.text(`Verification ID: ${cert.certificateNumber}`, 148, 152, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text("Verified by Za-Campus University · zacampus.vercel.app", 148, 183, { align: "center" });
    doc.save(`Za-Campus_Credential_${cert.certificateNumber}.pdf`);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Credentials</p>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Certificates</h1>
        <p className="text-sm text-gray-500 mt-1">{certs.length} credential{certs.length !== 1 ? "s" : ""} earned</p>
      </div>

      {certs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Award className="w-7 h-7 text-gray-300" /></div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No Credentials Yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">Complete a final examination with a score of 12/20 or higher to earn your credential.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map(cert => (
            <div key={cert.id} className="card p-5 border-l-2 border-amber-300 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-md bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0 border border-amber-200"><Award className="w-5 h-5 text-amber-600" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="badge badge-warning">{cert.class?.code}</span><span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Verified</span></div>
                  <h3 className="text-sm font-bold text-gray-900">{cert.class?.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>Grade: <strong className="text-gray-900">{cert.score}/{cert.maxScore}</strong></span>
                    <span>·</span>
                    <span>{new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 font-mono">ID: {cert.certificateNumber}</p>
                </div>
                <button onClick={() => download(cert)} className="btn-accent !text-xs !px-3 !py-2 flex-shrink-0"><Download className="w-3.5 h-3.5" /> PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
