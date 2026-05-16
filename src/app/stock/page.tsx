"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Edit2, Package, AlertTriangle, Check, Tag, Trash2, AlertCircle, XCircle, LayoutGrid } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product } from "@/lib/supabase/types";
import { useTranslation } from "@/context/LanguageContext";

type ProductWithCat = Product & { categories: { name: string } | null };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function StockPage() {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<ProductWithCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(t("common_all"));
  const [filter, setFilter] = useState<"all"|"low"|"out">("all");
  const [editId, setEditId] = useState<string|null>(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving] = useState(false);

  const MIN_STOCK = 5;

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", STORE_ID)
        .order("name");
      if (data) setProducts(data as ProductWithCat[]);
      setLoading(false);
    }
    load();
  }, []);

  const ALL = t("common_all");
  const categories = [ALL, ...new Set(products.map(p => p.categories?.name ?? "อื่นๆ").filter(Boolean))];

  const filtered = products.filter(p =>
    (categoryFilter === ALL || p.categories?.name === categoryFilter) &&
    (search === "" || p.name.includes(search) || (p.sku ?? "").includes(search)) &&
    (filter === "all" ||
     (filter === "low" && p.stock > 0 && p.stock <= MIN_STOCK) ||
     (filter === "out" && p.stock === 0))
  );

  const saveStock = async (id: string) => {
    const val = parseInt(editStock);
    if (isNaN(val) || val < 0) { setEditId(null); return; }
    setSaving(true);
    await (supabase.from("products") as any).update({ stock: val }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: val } : p));
    setEditId(null);
    setSaving(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">{t("stock_title")}</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> {t("stock_add_product")}
              </button>
            </div>
            {/* Status pills — 5 colored filter chips matching demo */}
            <div className="grid grid-cols-5 gap-3">
              {([
                { v: "all" as const, label: t("stock_ready_to_sell"), color: "#22c55e", Icon: Check },
                { v: "all" as const, label: t("stock_has_discount"),  color: "#3b82f6", Icon: Tag },
                { v: "all" as const, label: t("stock_trash"),         color: "#a855f7", Icon: Trash2 },
                { v: "low" as const, label: t("stock_filter_low"),    color: "#f59e0b", Icon: AlertCircle },
                { v: "out" as const, label: t("stock_filter_out"),    color: "#ef4444", Icon: XCircle },
              ]).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setFilter(p.v)}
                  className={clsx(
                    "flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border transition-all hover:-translate-y-0.5",
                    filter === p.v ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"
                  )}
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white flex-shrink-0"
                    style={{ background: p.color }}
                  >
                    <p.Icon size={14} />
                  </span>
                  <span className="text-[13px] font-medium text-slate-700 truncate">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Include related checkbox */}
            <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-blue-600" />
              {t("stock_include_related")}
            </label>

            {/* Filter bar — 4 dropdowns + search + ค้นหา button + grid toggle */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2 flex-wrap">
              <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none min-w-24">
                <option>{t("col_status")}</option>
              </select>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none min-w-28">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none min-w-24">
                <option>{t("stock_location")}</option>
              </select>
              <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none min-w-20">
                <option>{t("stock_unit")}</option>
              </select>
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("stock_search_placeholder")}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "#0284c7" }}>
                <Search size={14} /> {t("common_search")}
              </button>
              <button className="flex items-center justify-center w-10 h-10 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                <LayoutGrid size={16} />
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_name")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_sku")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_category")}</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">{t("col_price")}</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">{t("col_cost")}</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">{t("col_stock")}</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">{t("col_status")}</th>
                      <th className="px-4 py-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const isLow = p.stock > 0 && p.stock <= MIN_STOCK;
                      const isOut = p.stock === 0;
                      return (
                        <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="text-xl">{p.emoji}</span><span className="font-medium text-slate-800">{p.name}</span></div></td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">{p.sku ?? "-"}</td>
                          <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{p.categories?.name ?? "-"}</span></td>
                          <td className="px-4 py-3 text-right font-medium">{thb(p.price)} ฿</td>
                          <td className="px-4 py-3 text-right text-slate-500">{thb(p.cost)} ฿</td>
                          <td className="px-4 py-3 text-right">
                            {editId===p.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <input type="number" value={editStock} onChange={e=>setEditStock(e.target.value)}
                                  onKeyDown={e=>{if(e.key==="Enter")saveStock(p.id);if(e.key==="Escape")setEditId(null);}}
                                  autoFocus className="w-20 border border-blue-400 rounded-lg px-2 py-1 text-right text-sm focus:outline-none"/>
                                <button onClick={()=>saveStock(p.id)} disabled={saving} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">{t("common_save")}</button>
                              </div>
                            ) : (
                              <span className={clsx("font-bold", isOut?"text-red-500":isLow?"text-amber-500":"text-slate-800")}>
                                {isLow&&<AlertTriangle size={12} className="inline mr-1 text-amber-400"/>}
                                {p.stock}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                              isOut?"bg-red-100 text-red-600":isLow?"bg-amber-100 text-amber-600":p.active?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500")}>
                              {isOut ? t("status_out_of_stock") : isLow ? t("status_low_stock") : p.active ? t("status_normal") : t("status_inactive")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={()=>{setEditId(p.id);setEditStock(String(p.stock));}}
                              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={13}/>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {!loading&&filtered.length===0&&(
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2"><Package size={40} strokeWidth={1}/><p>{t("common_no_data")}</p></div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
