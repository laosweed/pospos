"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Edit2, Mail, Award, X, Filter, ChevronDown, LayoutGrid, ArrowUpDown, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Customer } from "@/lib/supabase/types";
import { useTranslation } from "@/context/LanguageContext";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

const EMPTY_FORM = { name:"", phone:"", email:"" };

export default function CustomersPage() {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function tierLabel(points: number) {
    if (points >= 1000) return { label: t("tier_gold"),   color:"#f59e0b", bg:"#fffbeb" };
    if (points >= 400)  return { label: t("tier_silver"), color:"#64748b", bg:"#f8fafc" };
    return                     { label: t("tier_bronze"), color:"#b45309", bg:"#fef3c7" };
  }

  const load = async () => {
    const { data } = await supabase.from("customers").select("*").eq("store_id", STORE_ID).order("name");
    if (data) setCustomers(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    search === "" || c.name.includes(search) || (c.phone ?? "").includes(search) || (c.email ?? "").includes(search)
  );

  const openNew = () => { setForm(EMPTY_FORM); setSelected({} as Customer); setIsNew(true); };
  const openEdit = (c: Customer) => { setForm({ name: c.name, phone: c.phone ?? "", email: c.email ?? "" }); setSelected(c); setIsNew(false); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { name: form.name, phone: form.phone || null, email: form.email || null };
    if (isNew) {
      await (supabase.from("customers") as any).insert({ store_id: STORE_ID, points: 0, ...payload });
    } else if (selected?.id) {
      await (supabase.from("customers") as any).update(payload).eq("id", selected.id);
    }
    await load();
    setSelected(null);
    setSaving(false);
  };

  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            {/* Filter row: filter dropdown + search + Add + grid toggle */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Filter size={13} /> {t("cust_filter")} <ChevronDown size={13} className="text-slate-400" />
              </button>
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("customers_search_placeholder")}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <button onClick={openNew} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                <Plus size={13} /> {t("customers_add")}
              </button>
              <button className="flex items-center justify-center w-10 h-10 border border-slate-200 rounded-lg text-slate-700 bg-slate-100">
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* ค้นหา / เคลียร์ action buttons */}
            <div className="flex justify-center gap-2">
              <button className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "#0284c7" }}>
                <Search size={14} /> {t("common_search")}
              </button>
              <button className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white hover:bg-slate-50">
                <Filter size={14} /> {t("rep_clear_btn")}
              </button>
            </div>

            {/* Stats line: count + Show + pagination */}
            <div className="flex items-center justify-between text-sm text-slate-600 px-1">
              <span>{filtered.length} {t("cust_items")}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  {t("cust_show")}
                  <select className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none">
                    <option>10</option><option>25</option><option>50</option>
                  </select>
                </span>
                <div className="flex items-center gap-0">
                  <button className="px-3 py-1 border border-slate-200 rounded-l text-xs text-slate-500 hover:bg-slate-50">{t("cust_prev")}</button>
                  <button className="px-3 py-1 border-y border-slate-200 text-xs font-semibold bg-white text-slate-700">1</button>
                  <button className="px-3 py-1 border border-slate-200 rounded-r text-xs text-slate-500 hover:bg-slate-50">{t("cust_next")}</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-3 py-3 w-8 text-center text-slate-400"><MoreHorizontal size={14} /></th>
                      <th className="px-3 py-3 w-8 text-center"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-600" /></th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">{t("cust_id_col")} <ArrowUpDown size={11} className="text-slate-300" /></span>
                      </th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">{t("label_full_name")} <ArrowUpDown size={11} className="text-slate-300" /></span>
                      </th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">{t("cust_type_col")} <ArrowUpDown size={11} className="text-slate-300" /></span>
                      </th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">{t("cust_level_col")} <ArrowUpDown size={11} className="text-slate-300" /></span>
                      </th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("cust_phone_col")}</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">{t("cust_birthday_col")} <ArrowUpDown size={11} className="text-slate-300" /></span>
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, idx) => {
                      const tier = tierLabel(c.points);
                      const custId = `M${String(idx).padStart(6, "0")}`;
                      return (
                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3 text-center text-slate-400 hover:text-slate-600 cursor-pointer"><MoreHorizontal size={14} /></td>
                          <td className="px-3 py-3 text-center"><input type="checkbox" className="w-3.5 h-3.5 accent-blue-600" /></td>
                          <td className="px-4 py-3 font-mono text-[12px] text-blue-600">{custId}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{c.name[0]}</div>
                              <span className="font-medium text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{t("cust_type_member")}</td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: tier.color, background: tier.bg }}>{tier.label}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{c.phone ?? "-"}</td>
                          <td className="px-4 py-3 text-slate-400 text-[12px]">{c.email ? <span title={c.email} className="inline-flex items-center gap-1"><Mail size={11}/>{c.email.slice(0,18)}</span> : "-"}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={13} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {selected !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[380px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-800">{isNew ? t("customers_new_title") : t("customers_edit_title")}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {([[ t("label_full_name"),"name"],[ t("label_phone"),"phone"],[ t("label_email"),"email"]] as const).map(([l, k]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              {!isNew && selected?.id && (
                <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{t("col_points")}</p>
                    <p className="text-2xl font-bold text-amber-500">{thb(selected.points)} <span className="text-sm">{t("customers_points_unit")}</span></p>
                  </div>
                  <Award size={32} className="text-amber-400" />
                </div>
              )}
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                {saving ? t("common_saving") : t("common_save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
