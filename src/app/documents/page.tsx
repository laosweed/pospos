"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FileText, Search, Download, Eye, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Sale } from "@/lib/supabase/types";

type SaleDoc = Sale & { employees: { name: string } | null; customers: { name: string } | null };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) { return new Date(s).toLocaleDateString("th-TH"); }

export default function DocumentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sales, setSales] = useState<SaleDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"receipt" | "tax">("receipt");
  const [preview, setPreview] = useState<SaleDoc | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("sales").select("*, employees(name), customers(name)")
        .eq("store_id", STORE_ID).eq("status", "completed")
        .order("sold_at", { ascending: false }).limit(100);
      if (data) setSales(data as SaleDoc[]);
      setLoading(false);
    })();
  }, []);

  const filtered = sales.filter(s =>
    search === "" || (s.receipt_no ?? "").includes(search) || (s.customers?.name ?? "").includes(search)
  );

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">เอกสาร</h1>
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                <button onClick={() => setType("receipt")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === "receipt" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>ใบเสร็จ</button>
                <button onClick={() => setType("tax")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === "tax" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>ใบกำกับภาษี</button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาเลขที่เอกสาร ลูกค้า..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">เลขที่</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">ลูกค้า</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอด</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600 font-medium">{type === "receipt" ? s.receipt_no ?? "-" : `TAX-${s.receipt_no ?? s.id.slice(0,8)}`}</td>
                        <td className="px-4 py-3 text-slate-500">{fmtDate(s.sold_at)}</td>
                        <td className="px-4 py-3 text-slate-700">{s.customers?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-right font-bold">{thb(s.total)} ฿</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => setPreview(s)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg"><Download size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <FileText size={40} strokeWidth={1} /><p>ไม่พบเอกสาร</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">{type === "receipt" ? "ใบเสร็จรับเงิน" : "ใบกำกับภาษี"}</h2>
              <button onClick={() => setPreview(null)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="text-center border-b pb-4 mb-4">
              <p className="font-bold text-slate-800">ร้านเบเกอรี่ (ตัวอย่าง)</p>
              <p className="text-[12px] text-slate-500">เลขที่: {preview.receipt_no ?? preview.id.slice(0,8)}</p>
              <p className="text-[12px] text-slate-500">วันที่: {fmtDate(preview.sold_at)}</p>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-slate-500">พนักงาน</span><span>{preview.employees?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ลูกค้า</span><span>{preview.customers?.name ?? "-"}</span></div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>ยอดสุทธิ</span><span className="text-blue-600">{thb(preview.total)} ฿</span>
              </div>
              {preview.vat > 0 && <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>VAT 7%</span><span>{thb(preview.vat)} ฿</span>
              </div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
