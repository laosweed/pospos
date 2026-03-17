"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ShoppingCart, Package, Activity } from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

type Event = { id: string; type: "sale" | "purchase"; title: string; detail: string; amount: number; time: string };

export default function ActivityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "sale" | "purchase">("all");

  useEffect(() => {
    (async () => {
      const [{ data: sales }, { data: purchases }] = await Promise.all([
        supabase.from("sales").select("id, total, sold_at, receipt_no, status, employees(name)").eq("store_id", STORE_ID).order("sold_at", { ascending: false }).limit(50),
        supabase.from("purchases").select("id, total, purchased_at, supplier, employees(name)").eq("store_id", STORE_ID).order("purchased_at", { ascending: false }).limit(50),
      ]);

      const saleEvents: Event[] = (sales ?? []).map((s: { id: string; total: number; sold_at: string; receipt_no: string | null; status: string; employees: { name: string } | null }) => ({
        id: s.id,
        type: "sale" as const,
        title: `ขายสินค้า #${s.receipt_no ?? s.id.slice(0, 8)}`,
        detail: `โดย ${(s.employees as { name: string } | null)?.name ?? "-"} · ${s.status === "completed" ? "สำเร็จ" : "ยกเลิก"}`,
        amount: s.total,
        time: s.sold_at,
      }));

      const purchaseEvents: Event[] = (purchases ?? []).map((p: { id: string; total: number; purchased_at: string; supplier: string | null; employees: { name: string } | null }) => ({
        id: p.id,
        type: "purchase" as const,
        title: `รับสินค้า${p.supplier ? ` จาก ${p.supplier}` : ""}`,
        detail: `โดย ${(p.employees as { name: string } | null)?.name ?? "-"}`,
        amount: p.total,
        time: p.purchased_at,
      }));

      const all = [...saleEvents, ...purchaseEvents].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setEvents(all);
      setLoading(false);
    })();
  }, []);

  const filtered = events.filter(e => filter === "all" || e.type === filter);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">กิจกรรมล่าสุด</h1>
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                {(["all","sale","purchase"] as const).map(v => (
                  <button key={v} onClick={() => setFilter(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === v ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    {v === "all" ? "ทั้งหมด" : v === "sale" ? "ขาย" : "รับสินค้า"}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-24"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                    <Activity size={48} strokeWidth={1} /><p>ยังไม่มีกิจกรรม</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filtered.map(e => (
                      <div key={e.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${e.type === "sale" ? "bg-blue-50" : "bg-emerald-50"}`}>
                          {e.type === "sale" ? <ShoppingCart size={18} className="text-blue-500" /> : <Package size={18} className="text-emerald-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm">{e.title}</p>
                          <p className="text-[12px] text-slate-400 mt-0.5">{e.detail}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-sm ${e.type === "sale" ? "text-blue-600" : "text-emerald-600"}`}>
                            {e.type === "sale" ? "+" : "-"}{thb(e.amount)} ฿
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{fmtDate(e.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
