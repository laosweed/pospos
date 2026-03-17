"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Trash2, Gift, X, Calendar } from "lucide-react";
import clsx from "clsx";

type Promo = { id: number; name: string; desc: string; startDate: string; endDate: string; type: string; active: boolean };

const INIT: Promo[] = [
  { id: 1, name: "ซื้อ 1 แถม 1 ครัวซองต์", desc: "ซื้อครัวซองต์ 1 ชิ้น แถมฟรี 1 ชิ้น", startDate: "2026-03-01", endDate: "2026-03-31", type: "buy1get1", active: true },
  { id: 2, name: "Happy Hour ลด 20%", desc: "ทุกวันจันทร์-ศุกร์ เวลา 14:00-16:00", startDate: "2026-03-01", endDate: "2026-06-30", type: "time", active: true },
  { id: 3, name: "วันเกิดลด 30%", desc: "ลด 30% สำหรับลูกค้าที่วันเกิดตรงกับวันนี้", startDate: "2026-01-01", endDate: "2026-12-31", type: "birthday", active: false },
];

let nextId = 10;

export default function PromotionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promos, setPromos] = useState<Promo[]>(INIT);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState({ name: "", desc: "", startDate: "", endDate: "", type: "discount", active: true });

  const openNew = () => { setEditing(null); setForm({ name: "", desc: "", startDate: "", endDate: "", type: "discount", active: true }); setModal(true); };
  const openEdit = (p: Promo) => { setEditing(p); setForm({ name: p.name, desc: p.desc, startDate: p.startDate, endDate: p.endDate, type: p.type, active: p.active }); setModal(true); };
  const save = () => {
    const data: Promo = { id: editing?.id ?? nextId++, ...form };
    setPromos(prev => editing ? prev.map(p => p.id === editing.id ? data : p) : [...prev, data]);
    setModal(false);
  };
  const toggle = (id: number) => setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  const TYPE_LABELS: Record<string, string> = { discount: "ส่วนลด", buy1get1: "ซื้อ 1 แถม 1", time: "ช่วงเวลา", birthday: "วันเกิด", bundle: "แพ็กเกจ" };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">โปรโมชั่น</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มโปรโมชั่น
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {promos.map(p => (
                <div key={p.id} className={clsx("bg-white rounded-xl p-5 shadow-sm border-l-4 transition-opacity", p.active ? "border-blue-500" : "border-slate-200 opacity-60")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Gift size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{p.name}</h3>
                        <p className="text-[12px] text-slate-500 mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setPromos(prev => prev.filter(x => x.id !== p.id))} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-[12px] text-slate-500">
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">{TYPE_LABELS[p.type] ?? p.type}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {p.startDate} – {p.endDate}</span>
                    </div>
                    <button onClick={() => toggle(p.id)}
                      className={clsx("relative w-10 h-5 rounded-full transition-colors", p.active ? "bg-emerald-500" : "bg-slate-200")}>
                      <span className={clsx("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", p.active ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {promos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2 bg-white rounded-xl">
                <Gift size={48} strokeWidth={1} /><p>ยังไม่มีโปรโมชั่น</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editing ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่น"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">ชื่อโปรโมชั่น</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">รายละเอียด</label>
                <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">ประเภท</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">วันเริ่ม</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">วันสิ้นสุด</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">ยกเลิก</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
