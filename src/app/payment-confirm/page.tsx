"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, CheckCircle2, XCircle, Clock, Eye, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Sale, SaleItem } from "@/lib/supabase/types";
import { useTranslation } from "@/context/LanguageContext";

type SaleWithDetails = Sale & {
  employees: { name: string } | null;
  customers: { name: string } | null;
  sale_items: Pick<SaleItem, "name" | "price" | "quantity" | "subtotal">[];
};

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export default function PaymentConfirmPage() {
  const t = useTranslation();
  const PM: Record<string, string> = {
    cash: t("payment_cash"),
    card: t("payment_card"),
    transfer: t("item_transfer"),
    qr: t("payment_qr"),
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SaleWithDetails | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("sales")
        .select("*, employees(name), customers(name), sale_items(name, price, quantity, subtotal)")
        .eq("store_id", STORE_ID)
        .order("sold_at", { ascending: false })
        .limit(300);
      if (data) setSales(data as SaleWithDetails[]);
      setLoading(false);
    })();
  }, []);

  const filtered = sales.filter(s =>
    (filter === "all" || s.status === filter) &&
    (search === "" || (s.receipt_no ?? "").includes(search) || (s.customers?.name ?? "").includes(search))
  );

  const confirm = async (id: string) => {
    await (supabase.from("sales") as any).update({ status: "completed" }).eq("id", id);
    setSales(p => p.map(s => s.id === id ? { ...s, status: "completed" } : s));
    setSelected(p => p?.id === id ? { ...p, status: "completed" } : p);
  };
  const cancel = async (id: string) => {
    await (supabase.from("sales") as any).update({ status: "cancelled" }).eq("id", id);
    setSales(p => p.map(s => s.id === id ? { ...s, status: "cancelled" } : s));
    setSelected(p => p?.id === id ? { ...p, status: "cancelled" } : p);
  };

  const counts = {
    completed: sales.filter(s => s.status === "completed").length,
    pending: sales.filter(s => s.status === "pending").length,
    cancelled: sales.filter(s => s.status === "cancelled").length,
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <h1 className="text-xl font-bold text-slate-800">{t("pay_confirm_title")}</h1>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t("pay_confirm_paid"), count: counts.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: t("pay_confirm_waiting"), count: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: t("status_cancelled"), count: counts.cancelled, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
              ].map(({ label, count, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500">{label}</p>
                    <p className={clsx("text-xl font-bold", color)}>{count}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("pay_confirm_search_placeholder")}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-1">
                {(["all","completed","pending","cancelled"] as const).map(v => (
                  <button key={v} onClick={() => setFilter(v)}
                    className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      filter === v ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                    {v === "all" ? t("common_all") : v === "completed" ? t("pay_confirm_paid") : v === "pending" ? t("pay_confirm_waiting") : t("status_cancelled")}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_receipt_no")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_date")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_customer")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("pay_confirm_channel")}</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">{t("pay_confirm_amount")}</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">{t("col_status")}</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(sale => (
                      <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600 font-medium">{sale.receipt_no ?? "-"}</td>
                        <td className="px-4 py-3 text-slate-500 text-[12px]">{fmtDate(sale.sold_at)}</td>
                        <td className="px-4 py-3">{sale.customers?.name ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full">{PM[sale.payment_method] ?? sale.payment_method}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold">{thb(sale.total)} ฿</td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                            sale.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                            sale.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600")}>
                            {sale.status === "completed" ? t("pay_confirm_paid") : sale.status === "pending" ? t("pay_confirm_waiting") : t("status_cancelled")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {sale.status === "pending" && (
                              <>
                                <button onClick={() => confirm(sale.id)} className="text-[11px] px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-colors">{t("pay_confirm_confirm_btn")}</button>
                                <button onClick={() => cancel(sale.id)} className="text-[11px] px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg font-medium transition-colors">{t("common_cancel")}</button>
                              </>
                            )}
                            <button onClick={() => setSelected(sale)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <CheckCircle2 size={40} strokeWidth={1} /><p>{t("pay_confirm_no_data")}</p>
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
              <h2 className="font-bold text-lg">{t("pay_confirm_bill_title")} #{selected.receipt_no ?? "-"}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-slate-500">{t("col_date")}</span><span>{fmtDate(selected.sold_at)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t("col_employee")}</span><span>{selected.employees?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t("col_customer")}</span><span>{selected.customers?.name ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t("pay_confirm_channel")}</span><span>{PM[selected.payment_method] ?? selected.payment_method}</span></div>
            </div>
            <div className="border-t pt-4 mb-4 space-y-2">
              {selected.sale_items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{thb(item.subtotal)} ฿</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>{t("pay_confirm_net")}</span><span className="text-blue-600">{thb(selected.total)} ฿</span>
            </div>
            {selected.status === "pending" && (
              <div className="mt-5 flex gap-2">
                <button onClick={() => confirm(selected.id)} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors">{t("pay_confirm_confirm_payment")}</button>
                <button onClick={() => cancel(selected.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors">{t("common_cancel")}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
