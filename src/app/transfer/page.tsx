"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ArrowRightLeft, Plus, X } from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import { useTranslation } from "@/context/LanguageContext";

type Product = { id: string; name: string; emoji: string; stock: number };
type Transfer = { id: number; from: string; to: string; product: string; qty: number; date: string; status: "completed" | "pending" };

const BRANCHES = ["สาขาหลัก (สยาม)", "สาขา 2 (อโศก)", "คลังสินค้า"];
const INIT_TRANSFERS: Transfer[] = [
  { id: 1, from: "สาขาหลัก (สยาม)", to: "สาขา 2 (อโศก)", product: "ครัวซองต์เนย", qty: 10, date: "2026-03-10", status: "completed" },
  { id: 2, from: "คลังสินค้า", to: "สาขาหลัก (สยาม)", product: "ชานมไข่มุก", qty: 20, date: "2026-03-12", status: "pending" },
];
let nextId = 10;

export default function TransferPage() {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transfers, setTransfers] = useState<Transfer[]>(INIT_TRANSFERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ from: BRANCHES[0], to: BRANCHES[1], productId: "", qty: "" });

  useEffect(() => {
    supabase.from("products").select("id, name, emoji, stock").eq("store_id", STORE_ID).then(({ data }) => {
      if (data) setProducts(data as Product[]);
    });
  }, []);

  const save = () => {
    const prod = products.find(p => p.id === form.productId);
    if (!prod) return;
    setTransfers(p => [{ id: nextId++, from: form.from, to: form.to, product: prod.name, qty: parseInt(form.qty) || 0, date: new Date().toISOString().split("T")[0], status: "pending" }, ...p]);
    setModal(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">{t("transfer_title")}</h1>
              <button onClick={() => { setForm({ from: BRANCHES[0], to: BRANCHES[1], productId: "", qty: "" }); setModal(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> {t("transfer_create")}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_date")}</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("transfer_from")}</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("transfer_to")}</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">{t("col_name")}</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">{t("transfer_qty")}</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">{t("col_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map(tr => (
                    <tr key={tr.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500">{new Date(tr.date).toLocaleDateString("th-TH")}</td>
                      <td className="px-4 py-3 text-slate-700">{tr.from}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-700"><ArrowRightLeft size={12} className="text-blue-400" />{tr.to}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{tr.product}</td>
                      <td className="px-4 py-3 text-center font-bold">{tr.qty}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${tr.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                          {tr.status === "completed" ? t("transfer_done") : t("status_pending")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transfers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <ArrowRightLeft size={40} strokeWidth={1} /><p>{t("transfer_no_data")}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{t("transfer_modal_title")}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">{t("transfer_from_branch")}</label>
                <select value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">{t("transfer_to_branch")}</label>
                <select value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">{t("col_name")}</label>
                <select value={form.productId} onChange={e => setForm(p => ({ ...p, productId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">{t("transfer_select_product")}</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} ({t("transfer_stock_left")} {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">{t("transfer_qty")}</label>
                <input type="number" min="1" value={form.qty} onChange={e => setForm(p => ({ ...p, qty: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">{t("common_cancel")}</button>
              <button onClick={save} disabled={!form.productId || !form.qty} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">{t("transfer_create_btn")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
