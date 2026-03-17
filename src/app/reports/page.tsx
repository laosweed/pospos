"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { TrendingUp, ShoppingBag, Users, BarChart2 } from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) { return new Date(s).toLocaleDateString("th-TH"); }

type DaySummary = { sale_date: string; total_bills: number; cancelled_bills: number; total_revenue: number; avg_per_bill: number };
type TopProduct = { name: string; qty: number; revenue: number };

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [summary, setSummary] = useState<DaySummary[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const from = new Date();
      from.setDate(from.getDate() - parseInt(period));
      const fromStr = from.toISOString();

      const [{ data: sumData }, { data: itemData }] = await Promise.all([
        supabase.from("daily_sales_summary").select("*").eq("store_id", STORE_ID).gte("sale_date", from.toISOString().split("T")[0]).order("sale_date", { ascending: false }),
        supabase.from("sale_items").select("name, quantity, subtotal, sales!inner(store_id, sold_at, status)").eq("sales.store_id", STORE_ID).eq("sales.status", "completed").gte("sales.sold_at", fromStr),
      ]);

      if (sumData) setSummary(sumData as DaySummary[]);

      if (itemData) {
        const map: Record<string, TopProduct> = {};
        for (const item of itemData as { name: string; quantity: number; subtotal: number }[]) {
          if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 };
          map[item.name].qty += item.quantity;
          map[item.name].revenue += item.subtotal;
        }
        setTopProducts(Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10));
      }
      setLoading(false);
    };
    load();
  }, [period]);

  const totalRevenue = summary.reduce((s, d) => s + d.total_revenue, 0);
  const totalBills   = summary.reduce((s, d) => s + d.total_bills, 0);
  const avgPerBill   = totalBills > 0 ? totalRevenue / totalBills : 0;
  const maxRevenue   = Math.max(...summary.map(d => d.total_revenue), 1);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">รายงาน</h1>
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                {(["7","30","90"] as const).map(v => (
                  <button key={v} onClick={() => setPeriod(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === v ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    {v} วัน
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-24"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "รายได้รวม", value: thb(totalRevenue) + " ฿", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "จำนวนบิล", value: totalBills + " บิล", icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "เฉลี่ย/บิล", value: thb(avgPerBill) + " ฿", icon: BarChart2, color: "text-violet-600", bg: "bg-violet-50" },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
                        <Icon size={20} className={color} />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500">{label}</p>
                        <p className={`text-lg font-bold ${color}`}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-slate-700 mb-4">ยอดขายรายวัน</h2>
                  {summary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <BarChart2 size={40} strokeWidth={1} /><p>ยังไม่มีข้อมูล</p>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                      {[...summary].reverse().map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: 28 }}>
                          <span className="text-[9px] text-slate-400 font-medium">{thb(d.total_revenue / 1000)}k</span>
                          <div className="w-5 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" title={`${fmtDate(d.sale_date)}: ${thb(d.total_revenue)} ฿`}
                            style={{ height: `${Math.max(4, (d.total_revenue / maxRevenue) * 120)}px` }} />
                          <span className="text-[9px] text-slate-400" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{fmtDate(d.sale_date).slice(0, 5)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Top Products */}
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-blue-500" /> สินค้าขายดี
                    </h2>
                    {topProducts.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-8">ยังไม่มีข้อมูล</p>
                    ) : (
                      <div className="space-y-3">
                        {topProducts.map((p, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-sm mb-0.5">
                                <span className="truncate font-medium text-slate-700">{p.name}</span>
                                <span className="text-slate-500 ml-2 flex-shrink-0">{p.qty} ชิ้น</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(p.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }} />
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-700 flex-shrink-0">{thb(p.revenue)} ฿</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Daily Table */}
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <Users size={16} className="text-emerald-500" /> สรุปรายวัน
                    </h2>
                    <div className="overflow-auto max-h-64">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-500 text-[12px]">
                            <th className="text-left pb-2 font-medium">วันที่</th>
                            <th className="text-right pb-2 font-medium">บิล</th>
                            <th className="text-right pb-2 font-medium">รายได้</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.map((d, i) => (
                            <tr key={i} className="border-t border-slate-50">
                              <td className="py-2 text-slate-600">{fmtDate(d.sale_date)}</td>
                              <td className="py-2 text-right text-slate-700">{d.total_bills}</td>
                              <td className="py-2 text-right font-medium text-emerald-600">{thb(d.total_revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {summary.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">ยังไม่มีข้อมูล</p>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
