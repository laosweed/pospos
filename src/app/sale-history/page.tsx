"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Eye, X, Receipt } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Sale, SaleItem } from "@/lib/supabase/types";

type SaleWithDetails = Sale & {
  employees: { name: string } | null;
  customers: { name: string } | null;
  sale_items: Pick<SaleItem, "name" | "price" | "quantity" | "subtotal">[];
};

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour:"2-digit", minute:"2-digit" });
}

const STATUS_LABEL: Record<string, string> = { completed:"สำเร็จ", cancelled:"ยกเลิก", pending:"รอดำเนินการ" };
const PAYMENT_LABEL: Record<string, string> = { cash:"เงินสด", card:"บัตรเครดิต", qr:"QR Code" };

export default function SaleHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all"|"completed"|"cancelled">("all");
  const [selected, setSelected] = useState<SaleWithDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("sales")
        .select("*, employees(name), customers(name), sale_items(name, price, quantity, subtotal)")
        .eq("store_id", STORE_ID)
        .order("sold_at", { ascending: false })
        .limit(200);
      if (data) setSales(data as SaleWithDetails[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = sales.filter(s =>
    (statusFilter === "all" || s.status === statusFilter) &&
    (search === "" ||
      (s.receipt_no ?? "").includes(search) ||
      (s.customers?.name ?? "").includes(search) ||
      (s.employees?.name ?? "").includes(search))
  );

  const completed = sales.filter(s => s.status === "completed");
  const totalRevenue = completed.reduce((sum, s) => sum + s.total, 0);
  const totalBills   = completed.length;
  const cancelled    = sales.filter(s => s.status === "cancelled").length;

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <h1 className="text-xl font-bold text-slate-800">ประวัติการขาย</h1>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ยอดรวมทั้งหมด</p>
                <p className="text-[20px] font-bold text-blue-600">{thb(totalRevenue)} ฿</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">จำนวนบิล</p>
                <p className="text-[20px] font-bold text-emerald-600">{totalBills} บิล</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">บิลยกเลิก</p>
                <p className="text-[20px] font-bold text-red-500">{cancelled} บิล</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาเลขบิล ลูกค้า พนักงาน..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-1">
                {([["all","ทั้งหมด"],["completed","สำเร็จ"],["cancelled","ยกเลิก"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setStatusFilter(v)}
                    className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      statusFilter === v ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
              ) : (
                <>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 text-slate-500 font-medium">เลขบิล</th>
                        <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่/เวลา</th>
                        <th className="text-left px-4 py-3 text-slate-500 font-medium">พนักงาน</th>
                        <th className="text-left px-4 py-3 text-slate-500 font-medium">ลูกค้า</th>
                        <th className="text-left px-4 py-3 text-slate-500 font-medium">ชำระ</th>
                        <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอดรวม</th>
                        <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(sale => (
                        <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-blue-600 font-medium">{sale.receipt_no ?? "-"}</td>
                          <td className="px-4 py-3 text-slate-500">{fmtDate(sale.sold_at)}</td>
                          <td className="px-4 py-3 text-slate-700">{sale.employees?.name ?? "-"}</td>
                          <td className="px-4 py-3 text-slate-500">{sale.customers?.name ?? "-"}</td>
                          <td className="px-4 py-3">
                            <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full">
                              {PAYMENT_LABEL[sale.payment_method] ?? sale.payment_method}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold">
                            {sale.status === "cancelled" ? (
                              <span className="text-slate-400 line-through">{thb(sale.total)}</span>
                            ) : (
                              <span>{thb(sale.total)} ฿</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                              sale.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                              sale.status === "cancelled"  ? "bg-red-100 text-red-600" :
                              "bg-amber-100 text-amber-600"
                            )}>
                              {STATUS_LABEL[sale.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelected(sale)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                      <Receipt size={40} strokeWidth={1} />
                      <p>ไม่พบรายการ</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[400px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-800">ใบเสร็จ #{selected.receipt_no ?? "-"}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span className="text-slate-500">วันที่/เวลา</span><span>{fmtDate(selected.sold_at)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">พนักงาน</span><span>{selected.employees?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ลูกค้า</span><span>{selected.customers?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ชำระด้วย</span><span>{PAYMENT_LABEL[selected.payment_method] ?? selected.payment_method}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">สถานะ</span>
                <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                  selected.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-slate-700 mb-3">รายการสินค้า</h3>
              <div className="space-y-2">
                {selected.sale_items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{thb(item.subtotal)} ฿</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>ยอดรวม</span>
                <span>{thb(selected.sale_items.reduce((s,i)=>s+i.subtotal,0))} ฿</span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>ส่วนลด</span>
                  <span>-{thb(selected.discount)} ฿</span>
                </div>
              )}
              {selected.vat > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>VAT</span>
                  <span>{thb(selected.vat)} ฿</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base">
                <span>ยอดสุทธิ</span>
                <span className="text-blue-600">{thb(selected.total)} ฿</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
