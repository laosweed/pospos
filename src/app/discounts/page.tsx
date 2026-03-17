"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Trash2, Tag, X, Percent } from "lucide-react";
import clsx from "clsx";

type Discount = { id: number; name: string; type: "percent" | "fixed"; value: number; minOrder: number; active: boolean };

const INIT: Discount[] = [
  { id: 1, name: "ลูกค้าใหม่", type: "percent", value: 10, minOrder: 0, active: true },
  { id: 2, name: "ซื้อครบ 500", type: "fixed", value: 50, minOrder: 500, active: true },
  { id: 3, name: "Happy Hour", type: "percent", value: 15, minOrder: 0, active: false },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }
let nextId = 10;

export default function DiscountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [discounts, setDiscounts] = useState<Discount[]>(INIT);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState({ name: "", type: "percent" as "percent" | "fixed", value: "", minOrder: "", active: true });

  const openNew = () => { setEditing(null); setForm({ name: "", type: "percent", value: "", minOrder: "", active: true }); setModal(true); };
  const openEdit = (d: Discount) => { setEditing(d); setForm({ name: d.name, type: d.type, value: String(d.value), minOrder: String(d.minOrder), active: d.active }); setModal(true); };

  const save = () => {
    const data: Discount = { id: editing?.id ?? nextId++, name: form.name, type: form.type, value: parseFloat(form.value) || 0, minOrder: parseFloat(form.minOrder) || 0, active: form.active };
    setDiscounts(prev => editing ? prev.map(d => d.id === editing.id ? data : d) : [...prev, data]);
    setModal(false);
  };
  const remove = (id: number) => setDiscounts(prev => prev.filter(d => d.id !== id));
  const toggle = (id: number) => setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ส่วนลด</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มส่วนลด
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ส่วนลดทั้งหมด</p>
                <p className="text-xl font-bold text-blue-600">{discounts.length} รายการ</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ใช้งานอยู่</p>
                <p className="text-xl font-bold text-emerald-600">{discounts.filter(d => d.active).length} รายการ</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ปิดใช้งาน</p>
                <p className="text-xl font-bold text-slate-400">{discounts.filter(d => !d.active).length} รายการ</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ชื่อส่วนลด</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ประเภท</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">มูลค่า</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอดขั้นต่ำ</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {discounts.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                        <Tag size={14} className="text-blue-400" /> {d.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("text-[11px] px-2 py-0.5 rounded-full font-medium",
                          d.type === "percent" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600")}>
                          {d.type === "percent" ? "เปอร์เซ็นต์" : "จำนวนเงิน"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-700">
                        {d.type === "percent" ? `${d.value}%` : `${thb(d.value)} ฿`}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{d.minOrder > 0 ? `${thb(d.minOrder)} ฿` : "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggle(d.id)}
                          className={clsx("relative w-10 h-5 rounded-full transition-colors", d.active ? "bg-emerald-500" : "bg-slate-200")}>
                          <span className={clsx("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", d.active ? "translate-x-5" : "translate-x-0.5")} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(d)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => remove(d.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {discounts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Percent size={40} strokeWidth={1} /><p>ยังไม่มีส่วนลด</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editing ? "แก้ไขส่วนลด" : "เพิ่มส่วนลด"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">ชื่อส่วนลด</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="เช่น ลูกค้าใหม่" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">ประเภท</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as "percent" | "fixed" }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="percent">เปอร์เซ็นต์ (%)</option>
                  <option value="fixed">จำนวนเงิน (฿)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">มูลค่า</label>
                  <input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} type="number" min="0"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">ยอดขั้นต่ำ (฿)</label>
                  <input value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} type="number" min="0"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="0" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-slate-700">เปิดใช้งาน</span>
              </label>
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
