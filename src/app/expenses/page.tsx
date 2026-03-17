"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Trash2, Wallet, X } from "lucide-react";

type Expense = { id: number; name: string; category: string; amount: number; date: string; note: string };

const CATS = ["ค่าวัตถุดิบ", "ค่าเช่า", "ค่าไฟ/น้ำ", "ค่าแรง", "ค่าขนส่ง", "ค่าการตลาด", "อื่นๆ"];
const INIT: Expense[] = [
  { id: 1, name: "ซื้อแป้งสาลี", category: "ค่าวัตถุดิบ", amount: 1200, date: "2026-03-01", note: "" },
  { id: 2, name: "ค่าเช่าร้าน มี.ค.", category: "ค่าเช่า", amount: 8000, date: "2026-03-01", note: "" },
  { id: 3, name: "ค่าไฟฟ้า", category: "ค่าไฟ/น้ำ", amount: 2300, date: "2026-03-05", note: "" },
];
let nextId = 10;

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function ExpensesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: CATS[0], amount: "", date: new Date().toISOString().split("T")[0], note: "" });

  const save = () => {
    setExpenses(prev => [{ id: nextId++, name: form.name, category: form.category, amount: parseFloat(form.amount) || 0, date: form.date, note: form.note }, ...prev]);
    setModal(false);
  };

  const totalByCategory = CATS.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.total > 0);

  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ค่าใช้จ่าย</h1>
              <button onClick={() => { setForm({ name: "", category: CATS[0], amount: "", date: new Date().toISOString().split("T")[0], note: "" }); setModal(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มค่าใช้จ่าย
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm col-span-2">
                <p className="text-[12px] text-slate-500">ค่าใช้จ่ายรวม</p>
                <p className="text-2xl font-bold text-red-500">{thb(grandTotal)} ฿</p>
              </div>
              {totalByCategory.slice(0, 2).map(c => (
                <div key={c.cat} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500 truncate">{c.cat}</p>
                  <p className="text-lg font-bold text-slate-700">{thb(c.total)} ฿</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">รายการ</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">หมวดหมู่</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">จำนวน</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">{e.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full">{e.category}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(e.date).toLocaleDateString("th-TH")}</td>
                      <td className="px-4 py-3 text-right font-bold text-red-500">{thb(e.amount)} ฿</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpenses(prev => prev.filter(x => x.id !== e.id))}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Wallet size={40} strokeWidth={1} /><p>ยังไม่มีค่าใช้จ่าย</p>
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
              <h2 className="font-bold text-lg">เพิ่มค่าใช้จ่าย</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">รายการ</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">หมวดหมู่</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">จำนวน (฿)</label>
                  <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} min="0"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">วันที่</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">หมายเหตุ</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">ยกเลิก</button>
              <button onClick={save} disabled={!form.name || !form.amount} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
