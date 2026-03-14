"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Trash2, X, TrendingDown } from "lucide-react";
import clsx from "clsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Expense {
  id: string; date: string; category: string; description: string; amount: number; note: string;
}

const CATS = ["ค่าวัตถุดิบ","ค่าเช่า","ค่าน้ำ/ไฟ","ค่าแรง","ค่าขนส่ง","ค่าการตลาด","อื่นๆ"];

const DEMO: Expense[] = [
  { id:"x1", date:"15/03/2026", category:"ค่าวัตถุดิบ",  description:"แป้ง เนย ไข่",         amount:2850, note:"" },
  { id:"x2", date:"14/03/2026", category:"ค่าน้ำ/ไฟ",   description:"ค่าไฟฟ้าเดือนมีนาคม",   amount:3200, note:"" },
  { id:"x3", date:"13/03/2026", category:"ค่าแรง",       description:"เงินเดือนพนักงาน 4 คน", amount:48000,note:"" },
  { id:"x4", date:"12/03/2026", category:"ค่าวัตถุดิบ",  description:"กาแฟ นม ครีม",           amount:1800, note:"" },
  { id:"x5", date:"10/03/2026", category:"ค่าเช่า",      description:"ค่าเช่าร้านเดือนมีนาคม", amount:15000,note:"" },
  { id:"x6", date:"08/03/2026", category:"ค่าการตลาด",   description:"โปรโมท Facebook",        amount:500,  note:"" },
  { id:"x7", date:"05/03/2026", category:"ค่าวัตถุดิบ",  description:"ผลไม้สด ช็อกโกแลต",      amount:1200, note:"" },
  { id:"x8", date:"01/03/2026", category:"ค่าขนส่ง",     description:"ค่าจัดส่งสินค้า",         amount:350,  note:"" },
];

const CHART_DATA = [
  { month:"ต.ค.", amount:65000 },
  { month:"พ.ย.", amount:72000 },
  { month:"ธ.ค.", amount:88000 },
  { month:"ม.ค.", amount:71000 },
  { month:"ก.พ.", amount:68000 },
  { month:"มี.ค.", amount:42000 },
];

const CAT_COLORS: Record<string, string> = {
  "ค่าวัตถุดิบ":"#3b82f6","ค่าเช่า":"#8b5cf6","ค่าน้ำ/ไฟ":"#06b6d4",
  "ค่าแรง":"#f59e0b","ค่าขนส่ง":"#10b981","ค่าการตลาด":"#ec4899","อื่นๆ":"#94a3b8",
};

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

export default function ExpensesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expenses, setExpenses] = useState(DEMO);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date:"", category:CATS[0], description:"", amount:"", note:"" });

  const totalThisMonth = expenses.reduce((s,e) => s + e.amount, 0);

  const catTotals = CATS.map(c => ({ cat: c, total: expenses.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0) }))
    .filter(c => c.total > 0).sort((a,b) => b.total - a.total);

  const handleAdd = () => {
    const amt = parseFloat(form.amount);
    if (!form.description || isNaN(amt)) return;
    setExpenses(prev => [{
      id: `x${Date.now()}`,
      date: form.date || new Date().toLocaleDateString("en-GB").split("/").join("/"),
      category: form.category,
      description: form.description,
      amount: amt,
      note: form.note,
    }, ...prev]);
    setShowAdd(false);
    setForm({ date:"", category:CATS[0], description:"", amount:"", note:"" });
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ค่าใช้จ่าย</h1>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> บันทึกค่าใช้จ่าย
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Monthly total */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">รายจ่ายเดือนนี้</p>
                <p className="text-[22px] font-bold text-red-500">{thb(totalThisMonth)} ฿</p>
              </div>

              {/* Category breakdown */}
              <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] font-medium text-slate-500 mb-3">แบ่งตามหมวดหมู่</p>
                <div className="space-y-1.5">
                  {catTotals.slice(0,4).map(c => (
                    <div key={c.cat} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[c.cat] ?? "#94a3b8" }} />
                      <span className="text-[12px] text-slate-600 flex-1">{c.cat}</span>
                      <span className="text-[12px] font-semibold text-slate-700">{thb(c.total)} ฿</span>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width:`${(c.total/totalThisMonth*100)}%`, background: CAT_COLORS[c.cat] ?? "#94a3b8" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-slate-700 mb-4">ค่าใช้จ่ายย้อนหลัง 6 เดือน</h2>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:"#94a3b8" }} />
                    <YAxis tick={{ fontSize:10, fill:"#94a3b8" }} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v:number) => [`${thb(v)} ฿`, "ค่าใช้จ่าย"]} contentStyle={{ fontSize:12, borderRadius:8 }} />
                    <Bar dataKey="amount" fill="#ef4444" radius={[4,4,0,0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">หมวดหมู่</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">รายละเอียด</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">จำนวนเงิน</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{e.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: CAT_COLORS[e.category] ?? "#94a3b8" }}>
                          {e.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{e.description}</td>
                      <td className="px-4 py-3 text-right font-bold text-red-500">{thb(e.amount)} ฿</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpenses(prev => prev.filter(x=>x.id!==e.id))} className="p-1.5 text-slate-300 hover:text-red-400 rounded-lg">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-800">บันทึกค่าใช้จ่าย</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">วันที่</label>
                  <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">หมวดหมู่</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                    {CATS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">รายละเอียด</label>
                <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="รายละเอียดค่าใช้จ่าย..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">จำนวนเงิน (฿)</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">ยกเลิก</button>
                <button onClick={handleAdd} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
