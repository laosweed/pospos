"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Trash2, Layers, X } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

type Level = { id: number; name: string; discount: number; color: string };
const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
const INIT: Level[] = [
  { id: 1, name: "ราคาปลีก", discount: 0, color: "#3b82f6" },
  { id: 2, name: "ราคาสมาชิก", discount: 5, color: "#10b981" },
  { id: 3, name: "ราคาส่ง", discount: 15, color: "#f59e0b" },
];
let nextId = 10;

export default function PriceLevelsPage() {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [levels, setLevels] = useState<Level[]>(INIT);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Level | null>(null);
  const [form, setForm] = useState({ name: "", discount: "", color: COLORS[0] });

  const open = (l?: Level) => { setEditing(l ?? null); setForm(l ? { name: l.name, discount: String(l.discount), color: l.color } : { name: "", discount: "", color: COLORS[0] }); setModal(true); };
  const save = () => {
    const d: Level = { id: editing?.id ?? nextId++, name: form.name, discount: parseFloat(form.discount) || 0, color: form.color };
    setLevels(p => editing ? p.map(l => l.id === editing.id ? d : l) : [...p, d]);
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
              <h1 className="text-xl font-bold text-slate-800">{t("price_levels_title")}</h1>
              <button onClick={() => open()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> {t("price_levels_add")}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {levels.map((l, i) => (
                <div key={l.id} className="bg-white rounded-xl p-5 shadow-sm border-t-4" style={{ borderColor: l.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Layers size={16} style={{ color: l.color }} />
                      <span className="font-semibold text-slate-800">{l.name}</span>
                      {i === 0 && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{t("price_levels_default")}</span>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => open(l)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                      {i > 0 && <button onClick={() => setLevels(p => p.filter(x => x.id !== l.id))} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-[12px] text-slate-500">{t("price_levels_discount_from")}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: l.color }}>{l.discount}%</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-slate-700 mb-3">{t("price_levels_example")}</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left pb-2 text-slate-500 font-medium">{t("price_levels_col_level")}</th>
                      <th className="text-right pb-2 text-slate-500 font-medium">{t("price_levels_col_discount")}</th>
                      <th className="text-right pb-2 text-slate-500 font-medium">{t("price_levels_col_paid")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map(l => (
                      <tr key={l.id} className="border-b border-slate-50">
                        <td className="py-2.5 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />{l.name}
                        </td>
                        <td className="py-2.5 text-right text-slate-500">{l.discount}%</td>
                        <td className="py-2.5 text-right font-bold" style={{ color: l.color }}>{(100 - l.discount).toFixed(0)} ฿</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? t("price_levels_edit_title") : t("price_levels_add_title")}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t("price_levels_name_placeholder")}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              <input value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} placeholder={t("price_levels_discount_placeholder")} type="number" min="0" max="100"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              <div>
                <p className="text-sm text-slate-600 mb-2">{t("price_levels_color")}</p>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background: c, borderColor: form.color === c ? "#1e293b" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">{t("common_cancel")}</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">{t("common_save")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
