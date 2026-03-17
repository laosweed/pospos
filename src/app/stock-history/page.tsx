"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Package, Eye, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Purchase, PurchaseItem } from "@/lib/supabase/types";

type PurchaseWithDetails = Purchase & {
  employees: { name: string } | null;
  purchase_items: Pick<PurchaseItem, "name" | "cost" | "quantity" | "subtotal">[];
};

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export default function StockHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PurchaseWithDetails | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, employees(name), purchase_items(name, cost, quantity, subtotal)")
        .eq("store_id", STORE_ID)
        .order("purchased_at", { ascending: false })
        .limit(200);
      if (data) setPurchases(data as PurchaseWithDetails[]);
      setLoading(false);
    })();
  }, []);

  const filtered = purchases.filter(p =>
    search === "" ||
    (p.supplier ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.employees?.name ?? "").includes(search)
  );

  const totalCost = purchases.filter(p => p.status === "completed").reduce((s, p) => s + p.total, 0);
  const totalOrders = purchases.filter(p => p.status === "completed").length;

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <h1 className="text-xl font-bold text-slate-800">ประวัติการรับสินค้า</h1>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ต้นทุนรวมทั้งหมด</p>
                <p className="text-xl font-bold text-blue-600">{thb(totalCost)} ฿</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">จำนวนครั้งรับสินค้า</p>
                <p className="text-xl font-bold text-emerald-600">{totalOrders} ครั้ง</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">เฉลี่ย/ครั้ง</p>
                <p className="text-xl font-bold text-violet-600">{thb(totalOrders > 0 ? totalCost / totalOrders : 0)} ฿</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาซัพพลายเออร์ พนักงาน..."
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
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">ซัพพลายเออร์</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">พนักงาน</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">รายการ</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">ต้นทุนรวม</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-500 text-[12px]">{fmtDate(p.purchased_at)}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{p.supplier ?? "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{p.employees?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{p.purchase_items.length} รายการ</td>
                        <td className="px-4 py-3 text-right font-bold">{thb(p.total)} ฿</td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                            p.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                            {p.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(p)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Package size={40} strokeWidth={1} /><p>ยังไม่มีประวัติการรับสินค้า</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[380px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">รายละเอียดการรับสินค้า</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-slate-500">วันที่</span><span>{fmtDate(selected.purchased_at)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ซัพพลายเออร์</span><span>{selected.supplier ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">พนักงาน</span><span>{selected.employees?.name ?? "-"}</span></div>
              {selected.note && <div className="flex justify-between"><span className="text-slate-500">หมายเหตุ</span><span>{selected.note}</span></div>}
            </div>
            <div className="border-t pt-4 mb-4 space-y-2">
              {selected.purchase_items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{thb(item.subtotal)} ฿</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>ต้นทุนรวม</span><span className="text-blue-600">{thb(selected.total)} ฿</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
