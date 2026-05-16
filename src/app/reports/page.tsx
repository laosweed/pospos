"use client";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import {
  BarChart2, ShoppingBag, Users, TrendingUp, CreditCard,
  Truck, FileText, StickyNote, Layers, Monitor, Gift, Store,
  Calendar, Download, Search, Receipt, Percent, ChevronDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";
import type { Dict } from "@/i18n/types";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtDate(s: string) { return new Date(s).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" }); }

type TabId = "graph" | "product" | "staff" | "customer" | "branch" | "payment" | "delivery" | "document" | "note" | "category" | "pos" | "promo";
type DaySummary = { sale_date: string; total_bills: number; cancelled_bills: number; total_revenue: number; avg_per_bill: number };
type TopProduct = { name: string; qty: number; revenue: number; cost: number };

export default function ReportsPage() {
  const t = useTranslation();
  const [tab, setTab] = useState<TabId>("graph");
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [summary, setSummary] = useState<DaySummary[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const TABS = [
    { id: "graph" as TabId,    label: t("rep_tab_graph"),    icon: BarChart2 },
    { id: "product" as TabId,  label: t("rep_tab_product"),  icon: ShoppingBag },
    { id: "staff" as TabId,    label: t("rep_tab_staff"),    icon: Users },
    { id: "customer" as TabId, label: t("rep_tab_customer"), icon: Users },
    { id: "branch" as TabId,   label: t("rep_tab_branch"),   icon: Store },
    { id: "payment" as TabId,  label: t("rep_tab_payment"),  icon: CreditCard },
    { id: "delivery" as TabId, label: t("rep_tab_delivery"), icon: Truck },
    { id: "document" as TabId, label: t("rep_tab_document"), icon: FileText },
    { id: "note" as TabId,     label: t("rep_tab_note"),     icon: StickyNote },
    { id: "category" as TabId, label: t("rep_tab_category"), icon: Layers },
    { id: "pos" as TabId,      label: t("rep_tab_pos"),      icon: Monitor },
    { id: "promo" as TabId,    label: t("rep_tab_promo"),    icon: Gift },
  ];

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
          if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0, cost: 0 };
          map[item.name].qty += item.quantity;
          map[item.name].revenue += item.subtotal;
        }
        setTopProducts(Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 20));
      }
      setLoading(false);
    };
    load();
  }, [period]);

  const totalRevenue = summary.reduce((s, d) => s + d.total_revenue, 0);
  const totalBills   = summary.reduce((s, d) => s + d.total_bills, 0);
  const avgPerBill   = totalBills > 0 ? totalRevenue / totalBills : 0;
  const maxRevenue   = Math.max(...summary.map(d => d.total_revenue), 1);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,"0")}/${String(today.getMonth()+1).padStart(2,"0")}/${today.getFullYear()}`;

  return (
    <PageShell>
      <div className="p-4 space-y-3">
        {/* ── 4 KPI cards (demo style: white card + colored icon column) ── */}
        <div className="grid grid-cols-4 gap-3">
          <KPICard icon={BarChart2} color="#f39c12" label={t("rep_kpi_profit")} value={thb(totalRevenue * 0.3)} />
          <KPICard icon={TrendingUp} color="#22c55e" label={t("rep_kpi_revenue")} value={thb(totalRevenue)} />
          <KPICard
            icon={Receipt}
            color="#3b82f6"
            label={t("rep_kpi_cost")}
            value={thb(totalRevenue * 0.6)}
            subText={
              <>
                <span className="text-slate-500">สินค้า: {thb(totalRevenue * 0.55)}</span>
                <span className="text-slate-400"> + </span>
                <span className="text-slate-500">ค่าใช้จ่าย: {thb(totalRevenue * 0.05)}</span>
              </>
            }
          />
          <KPICard
            icon={Percent}
            color="#ef4444"
            label={t("rep_kpi_discount")}
            value={thb(0)}
            subText={
              <>
                <span className="text-slate-500">ลดสินค้า: 0.00</span>
                <span className="text-slate-400"> + </span>
                <span className="text-slate-500">ลดท้ายบิล: 0.00</span>
              </>
            }
          />
        </div>

        {/* ── Toggle row: ผลกำไร checkbox + branch selector ── */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
            <span className="text-[13px] text-slate-700">{t("rep_show_profit")}</span>
          </label>
          <button className="flex-1 flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50">
            <span className="flex items-center gap-2 text-[13px] text-slate-700">
              <Store size={13} className="text-slate-400" />
              ร้านเบเกอรี่ (ตัวอย่าง)
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>

        {/* ── Main 2-column layout: LEFT vertical menu | RIGHT content ── */}
        <div className="bg-white rounded shadow-sm flex overflow-hidden" style={{ minHeight: 500 }}>

          {/* Left vertical sub-menu */}
          <aside className="flex-shrink-0 border-r border-slate-200" style={{ width: 180 }}>
            <button className="w-full flex items-center justify-between px-3 py-2.5 text-[12px] font-medium text-white bg-[#3c8dbc] border-b border-slate-200">
              ซ่อนเมนู <ChevronLeft size={12} />
            </button>
            <nav className="py-1">
              {TABS.map(tabItem => {
                const Icon = tabItem.icon;
                const active = tab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setTab(tabItem.id)}
                    className={clsx(
                      "w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-left transition-colors",
                      active
                        ? "bg-[#3c8dbc] text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    <span className="truncate">{tabItem.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right content area */}
          <div className="flex-1 min-w-0 p-4 space-y-3">
            {/* Filter row: date range + search + action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 min-w-24">
                {t("rep_today")} <ChevronDown size={13} className="text-slate-400" />
              </button>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button className="px-2 py-2 text-slate-400 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                <span className="px-2 py-2 text-[13px] text-slate-700 border-l border-r border-slate-200 flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  {dateStr} 00:00 - {dateStr} 23:59
                </span>
                <button className="px-2 py-2 text-slate-400 hover:bg-slate-50"><ChevronRight size={14} /></button>
              </div>
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 min-w-20">
                {t("common_all")} <ChevronDown size={13} className="text-slate-400" />
              </button>
              <div className="relative flex-1 min-w-32">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={t("common_search")}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[13px] font-medium" style={{ background: "#0284c7" }}>
                <Search size={13} /> {t("common_search")}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[13px] font-medium" style={{ background: "#22c55e" }}>
                <Download size={13} /> {t("rep_export_btn")} <ChevronDown size={11} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50">
                <Calendar size={13} /> {t("rep_clear_btn")}
              </button>
              {/* Period: 7/30/90 day quick filters preserved */}
              <div className="flex gap-0.5 bg-white rounded border border-slate-200 p-0.5">
                {(["7","30","90"] as const).map(v => (
                  <button key={v} onClick={() => setPeriod(v)}
                    className={clsx("px-2 py-1 rounded text-[11px] font-medium transition-colors",
                      period === v ? "bg-[#3c8dbc] text-white" : "text-slate-600 hover:bg-slate-100"
                    )}>
                    {v} {t("rep_days")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-[#3c8dbc] border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {tab === "graph" && <GraphTab summary={summary} maxRevenue={maxRevenue} t={t} />}
                {tab === "product" && <ProductTab products={topProducts} search={search} setSearch={setSearch} t={t} />}
                {tab === "staff" && <PlaceholderTab title={t("rep_staff_title")} description={t("rep_staff_desc")} connectText={t("rep_placeholder_connect")} icon={Users} />}
                {tab === "customer" && <PlaceholderTab title={t("rep_customer_title")} description={t("rep_customer_desc")} connectText={t("rep_placeholder_connect")} icon={Users} />}
                {tab === "branch" && <PlaceholderTab title={t("rep_branch_title")} description={t("rep_branch_desc")} connectText={t("rep_placeholder_connect")} icon={Store} />}
                {tab === "payment" && <PaymentTab totalRevenue={totalRevenue} t={t} />}
                {tab === "delivery" && <PlaceholderTab title={t("rep_delivery_title")} description={t("rep_delivery_desc")} connectText={t("rep_placeholder_connect")} icon={Truck} />}
                {tab === "document" && <PlaceholderTab title={t("rep_document_title")} description={t("rep_document_desc")} connectText={t("rep_placeholder_connect")} icon={FileText} />}
                {tab === "note" && <PlaceholderTab title={t("rep_note_title")} description={t("rep_note_desc")} connectText={t("rep_placeholder_connect")} icon={StickyNote} />}
                {tab === "category" && <CategoryTab products={topProducts} t={t} />}
                {tab === "pos" && <PlaceholderTab title={t("rep_pos_title")} description={t("rep_pos_desc")} connectText={t("rep_placeholder_connect")} icon={Monitor} />}
                {tab === "promo" && <PlaceholderTab title={t("rep_promo_title")} description={t("rep_promo_desc")} connectText={t("rep_placeholder_connect")} icon={Gift} />}
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ─── Tab content components ────────────────────────────────── */

function GraphTab({ summary, maxRevenue, t }: { summary: DaySummary[]; maxRevenue: number; t: (k: keyof Dict) => string }) {
  if (summary.length === 0) return <EmptyState text={t("rep_no_data")} />;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">{t("rep_daily_chart")}</h3>
      <div className="flex items-end gap-1 h-44 overflow-x-auto pb-2">
        {[...summary].reverse().map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: 28 }}>
            <span className="text-[9px] text-slate-400 font-medium">{thb(d.total_revenue / 1000)}k</span>
            <div
              className="w-5 rounded-t transition-colors hover:opacity-80"
              style={{
                background: "#3c8dbc",
                height: `${Math.max(4, (d.total_revenue / maxRevenue) * 140)}px`,
              }}
              title={`${fmtDate(d.sale_date)}: ${thb(d.total_revenue)} ฿`}
            />
            <span className="text-[9px] text-slate-400" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              {fmtDate(d.sale_date).slice(0, 5)}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px]">
              <th className="text-left px-3 py-2 font-semibold">{t("rep_col_date")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_bills")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_cancelled")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_total")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_avg")}</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((d, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-slate-600">{fmtDate(d.sale_date)}</td>
                <td className="px-3 py-2 text-right text-slate-700">{d.total_bills}</td>
                <td className="px-3 py-2 text-right text-red-500">{d.cancelled_bills}</td>
                <td className="px-3 py-2 text-right font-medium text-[#3c8dbc]">{thb(d.total_revenue)} ฿</td>
                <td className="px-3 py-2 text-right text-slate-500">{thb(d.avg_per_bill)} ฿</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-sm">
              <td className="px-3 py-2 text-slate-700">{t("rep_total")}</td>
              <td className="px-3 py-2 text-right">{summary.reduce((s, d) => s + d.total_bills, 0)}</td>
              <td className="px-3 py-2 text-right text-red-500">{summary.reduce((s, d) => s + d.cancelled_bills, 0)}</td>
              <td className="px-3 py-2 text-right text-[#3c8dbc]">{thb(summary.reduce((s, d) => s + d.total_revenue, 0))} ฿</td>
              <td className="px-3 py-2 text-right text-slate-500">
                {thb(summary.reduce((s, d) => s + d.total_revenue, 0) / Math.max(summary.reduce((s, d) => s + d.total_bills, 0), 1))} ฿
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function ProductTab({ products, search, setSearch, t }: { products: TopProduct[]; search: string; setSearch: (s: string) => void; t: (k: keyof Dict) => string }) {
  const filtered = search ? products.filter(p => p.name.includes(search)) : products;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{t("rep_tab_product")} {products.length}</h3>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("common_search")}
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#3c8dbc]"
          />
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState text={t("rep_no_product")} /> : (
        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px]">
                <th className="text-left px-3 py-2 font-semibold">#</th>
                <th className="text-left px-3 py-2 font-semibold">{t("col_name")}</th>
                <th className="text-right px-3 py-2 font-semibold">{t("rep_col_sold")}</th>
                <th className="text-right px-3 py-2 font-semibold">{t("rep_col_qty")}</th>
                <th className="text-right px-3 py-2 font-semibold">{t("rep_col_amount")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-700">{p.name}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{p.qty}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{p.qty}</td>
                  <td className="px-3 py-2 text-right font-medium text-[#3c8dbc]">{thb(p.revenue)} ฿</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                <td colSpan={2} className="px-3 py-2">{t("rep_total")}</td>
                <td className="px-3 py-2 text-right">{filtered.reduce((s, p) => s + p.qty, 0)}</td>
                <td className="px-3 py-2 text-right">{filtered.reduce((s, p) => s + p.qty, 0)}</td>
                <td className="px-3 py-2 text-right text-[#3c8dbc]">{thb(filtered.reduce((s, p) => s + p.revenue, 0))} ฿</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function PaymentTab({ totalRevenue, t }: { totalRevenue: number; t: (k: keyof Dict) => string }) {
  const methods = [
    { name: t("payment_cash"),     amount: totalRevenue * 0.6,  count: 12, color: "#3c8dbc" },
    { name: t("item_transfer"),    amount: totalRevenue * 0.2,  count: 5,  color: "#00a65a" },
    { name: t("payment_qr"),       amount: totalRevenue * 0.12, count: 4,  color: "#f39c12" },
    { name: t("payment_card"),     amount: totalRevenue * 0.05, count: 2,  color: "#dd4b39" },
    { name: t("payment_card"),     amount: totalRevenue * 0.03, count: 1,  color: "#605ca8" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{t("rep_payment_title")}</h3>
      <div className="border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px]">
              <th className="w-3 px-3 py-2"></th>
              <th className="text-left px-3 py-2 font-semibold">{t("rep_col_pay_method")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_bills")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_total")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_ratio")}</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2"><div className="w-3 h-3 rounded-sm" style={{ background: m.color }} /></td>
                <td className="px-3 py-2 font-medium text-slate-700">{m.name}</td>
                <td className="px-3 py-2 text-right text-slate-600">{m.count}</td>
                <td className="px-3 py-2 text-right font-medium" style={{ color: m.color }}>{thb(m.amount)} ฿</td>
                <td className="px-3 py-2 text-right text-slate-500">{((m.amount / Math.max(totalRevenue, 1)) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryTab({ products, t }: { products: TopProduct[]; t: (k: keyof Dict) => string }) {
  const categories = [
    { name: "เครื่องดื่ม", qty: 45, revenue: products.reduce((s, p) => s + p.revenue, 0) * 0.4 },
    { name: "เบเกอรี่",    qty: 32, revenue: products.reduce((s, p) => s + p.revenue, 0) * 0.35 },
    { name: "ขนมปัง",     qty: 20, revenue: products.reduce((s, p) => s + p.revenue, 0) * 0.15 },
    { name: "อื่นๆ",      qty: 10, revenue: products.reduce((s, p) => s + p.revenue, 0) * 0.1 },
  ];
  const totalRev = categories.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{t("rep_category_title")}</h3>
      <div className="border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px]">
              <th className="text-left px-3 py-2 font-semibold">{t("rep_col_category")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_sold")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_qty")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("rep_col_amount")}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 font-medium text-slate-700">{c.name}</td>
                <td className="px-3 py-2 text-right text-slate-600">{c.qty}</td>
                <td className="px-3 py-2 text-right text-slate-600">{c.qty}</td>
                <td className="px-3 py-2 text-right font-medium text-[#3c8dbc]">{thb(c.revenue)} ฿</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
              <td className="px-3 py-2">{t("rep_total")}</td>
              <td className="px-3 py-2 text-right">{categories.reduce((s, c) => s + c.qty, 0)}</td>
              <td className="px-3 py-2 text-right">{categories.reduce((s, c) => s + c.qty, 0)}</td>
              <td className="px-3 py-2 text-right text-[#3c8dbc]">{thb(totalRev)} ฿</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function PlaceholderTab({ title, description, connectText, icon: Icon }: { title: string; description: string; connectText: string; icon: typeof Users }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      <p className="text-xs text-slate-300">{connectText}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <BarChart2 size={40} strokeWidth={1} className="text-slate-200" />
      <span className="text-sm text-slate-400">{text}</span>
    </div>
  );
}

function KPICard({ icon: Icon, color, label, value, subText }: { icon: typeof TrendingUp; color: string; label: string; value: string; subText?: React.ReactNode }) {
  return (
    <div className="flex bg-white rounded-[10px] overflow-hidden shadow-sm">
      <div className="flex items-center justify-center flex-shrink-0" style={{ background: color, width: 60 }}>
        <Icon size={26} className="text-white" />
      </div>
      <div className="flex-1 min-w-0 px-3 py-2.5">
        <p className="text-[13px] text-slate-500 mb-0.5 truncate">{label}</p>
        <p className="text-[22px] font-bold leading-none" style={{ color }}>{value}</p>
        {subText && <p className="text-[10px] mt-1.5 truncate">{subText}</p>}
      </div>
    </div>
  );
}

