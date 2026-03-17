"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, AlertCircle, CheckCircle, X } from "lucide-react";

type Creditor = { id: number; name: string; amount: number; dueDate: string; paid: boolean; note: string };
const INIT: Creditor[] = [
  { id: 1, name: "บริษัท สยามแป้ง", amount: 15000, dueDate: "2026-03-20", paid: false, note: "ใบแจ้งหนี้ INV-2026-001" },
  { id: 2, name: "ร้านนมโค", amount: 8500, dueDate: "2026-03-15", paid: true, note: "" },
  { id: 3, name: "Thai Sugar Co.", amount: 6200, dueDate: "2026-03-25", paid: false, note: "" },
];
let nextId = 10;
function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function CreditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [creditors, setCreditors] = useState<Creditor[]>(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "", note: "" });

  const save = () => {
    setCreditors(p => [...p, { id: nextId++, name: form.name, amount: parseFloat(form.amount) || 0, dueDate: form.dueDate, paid: false, note: form.note }]);
    setModal(false);
  };
  const togglePaid = (id: number) => setCreditors(p => p.map(c => c.id === id ? { ...c, paid: !c.paid } : c));
  const totalOwed = creditors.filter(c => !c.paid).reduce((s, c) => s + c.amount, 0);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">เจ้าหนี้</h1>
              <button onClick={() => { setForm({ name: "", amount: "", dueDate: "", note: "" }); setModal(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มรายการ
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ยอดค้างชำระ</p>
                <p className="text-xl font-bold text-red-500">{thb(totalOwed)} ฿</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">รายการค้างชำระ</p>
                <p className="text-xl font-bold text-amber-600">{creditors.filter(c => !c.paid).length} รายการ</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ชำระแล้ว</p>
                <p className="text-xl font-bold text-emerald-600">{creditors.filter(c => c.paid).length} รายการ</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">เจ้าหนี้</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอด</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">กำหนดชำระ</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">หมายเหตุ</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {creditors.map(c => {
                    const overdue = !c.paid && new Date(c.dueDate) < new Date();
                    return (
                      <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-700">{c.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-red-500">{thb(c.amount)} ฿</td>
                        <td className="px-4 py-3 text-center">
                          <span className={overdue ? "text-red-500 font-medium" : "text-slate-500"}>
                            {new Date(c.dueDate).toLocaleDateString("th-TH")}
                            {overdue && " ⚠️"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[12px]">{c.note || "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${c.paid ? "bg-emerald-100 text-emerald-600" : overdue ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-600"}`}>
                            {c.paid ? "ชำระแล้ว" : overdue ? "เกินกำหนด" : "รอชำระ"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => togglePaid(c.id)}
                            className={`p-1.5 rounded-lg transition-colors ${c.paid ? "text-slate-400 hover:text-amber-500 hover:bg-amber-50" : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"}`}>
                            {c.paid ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">เพิ่มเจ้าหนี้</h2>
              <button onClick={() => setModal(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[["name","ชื่อเจ้าหนี้"],["note","หมายเหตุ"]].map(([k,l]) => (
                <div key={k}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{l}</label>
                  <input value={(form as Record<string,string>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">ยอดหนี้ (฿)</label>
                  <input type="number" min="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">กำหนดชำระ</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
              <button onClick={save} disabled={!form.name || !form.amount} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
