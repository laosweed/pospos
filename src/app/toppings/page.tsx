"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Trash2, ChefHat, X } from "lucide-react";

type Option = { id: number; name: string; price: number };
type Group = { id: number; name: string; required: boolean; multi: boolean; options: Option[] };

const INIT: Group[] = [
  { id: 1, name: "ขนาด", required: true, multi: false, options: [{ id: 1, name: "S", price: 0 }, { id: 2, name: "M", price: 10 }, { id: 3, name: "L", price: 20 }] },
  { id: 2, name: "หวาน", required: false, multi: false, options: [{ id: 4, name: "หวานน้อย", price: 0 }, { id: 5, name: "ปกติ", price: 0 }, { id: 6, name: "หวานมาก", price: 0 }] },
  { id: 3, name: "ท็อปปิ้ง", required: false, multi: true, options: [{ id: 7, name: "ไข่มุก", price: 10 }, { id: 8, name: "วิปครีม", price: 15 }, { id: 9, name: "โกโก้", price: 10 }] },
];
let gId = 10; let oId = 100;

export default function ToppingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [groups, setGroups] = useState<Group[]>(INIT);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState({ name: "", required: false, multi: false });
  const [opts, setOpts] = useState<Option[]>([]);
  const [of, setOf] = useState({ name: "", price: "" });

  const open = (g?: Group) => {
    setEditing(g ?? null);
    setForm(g ? { name: g.name, required: g.required, multi: g.multi } : { name: "", required: false, multi: false });
    setOpts(g ? [...g.options] : []);
    setModal(true);
  };
  const addOpt = () => { if (!of.name) return; setOpts(p => [...p, { id: oId++, name: of.name, price: parseFloat(of.price) || 0 }]); setOf({ name: "", price: "" }); };
  const save = () => {
    const d: Group = { id: editing?.id ?? gId++, ...form, options: opts };
    setGroups(p => editing ? p.map(g => g.id === editing.id ? d : g) : [...p, d]);
    setModal(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ท็อปปิ้ง / ตัวเลือกสินค้า</h1>
              <button onClick={() => open()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มกลุ่มตัวเลือก
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {groups.map(g => (
                <div key={g.id} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ChefHat size={16} className="text-blue-500" />
                      <span className="font-semibold text-slate-800">{g.name}</span>
                      {g.required && <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">จำเป็น</span>}
                      {g.multi && <span className="text-[10px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">หลายรายการ</span>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => open(g)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => setGroups(p => p.filter(x => x.id !== g.id))} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map(o => (
                      <span key={o.id} className="bg-slate-100 text-slate-700 text-[12px] px-3 py-1 rounded-full">
                        {o.name}{o.price > 0 ? ` +${o.price}฿` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? "แก้ไข" : "เพิ่ม"}กลุ่มตัวเลือก</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="ชื่อกลุ่ม"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              <div className="flex gap-4">
                {[["required","จำเป็น"],["multi","เลือกได้หลาย"]].map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={(form as Record<string, boolean>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} className="accent-blue-600" />
                    {l}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={of.name} onChange={e => setOf(p => ({ ...p, name: e.target.value }))} placeholder="ชื่อตัวเลือก"
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input value={of.price} onChange={e => setOf(p => ({ ...p, price: e.target.value }))} placeholder="+฿" type="number"
                  className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <button onClick={addOpt} className="px-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-8">
                {opts.map(o => (
                  <span key={o.id} className="flex items-center gap-1 bg-slate-100 text-slate-700 text-[12px] px-3 py-1 rounded-full">
                    {o.name}{o.price > 0 ? ` +${o.price}฿` : ""}
                    <button onClick={() => setOpts(p => p.filter(x => x.id !== o.id))}><X size={10} className="text-slate-400 hover:text-red-500" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
