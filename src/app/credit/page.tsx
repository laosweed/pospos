"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, CheckCircle, CreditCard, X } from "lucide-react";
type C = { id: number; customer: string; amount: number; date: string; dueDate: string; paid: boolean; note: string };
const INIT: C[] = [
  { id: 1, customer: "ประภา จันทร์", amount: 1500, date: "2026-03-05", dueDate: "2026-03-20", paid: false, note: "ค่าเค้กงานแต่ง" },
  { id: 2, customer: "อนุชา พรหมดี", amount: 850, date: "2026-03-08", dueDate: "2026-03-15", paid: true, note: "" },
];
let nId = 10;
function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
export default function CreditPage() {
  const [so, setSo] = useState(true);
  const [list, setList] = useState<C[]>(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer:"", amount:"", date: new Date().toISOString().split("T")[0], dueDate:"", note:"" });
  const save = () => { setList(p => [...p, { id: nId++, customer: form.customer, amount: parseFloat(form.amount)||0, date: form.date, dueDate: form.dueDate, paid: false, note: form.note }]); setModal(false); };
  const total = list.filter(c=>!c.paid).reduce((s,c)=>s+c.amount,0);
  return (<>
    <Navbar onToggleSidebar={() => setSo(v => !v)} />
    <div className="flex" style={{ marginTop: 50 }}>
      {so && <Sidebar />}
      <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: so ? 230 : 0, background: "#edf1f5" }}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">ขายเชื่อ / ลูกหนี้</h1>
            <button onClick={() => { setForm({ customer:"", amount:"", date: new Date().toISOString().split("T")[0], dueDate:"", note:"" }); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"><Plus size={16} /> บันทึกยอดเชื่อ</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["ยอดลูกหนี้รวม", thb(total)+" ฿","text-red-500"],["รอชำระ",list.filter(c=>!c.paid).length+" รายการ","text-amber-600"],["ชำระแล้ว",list.filter(c=>c.paid).length+" รายการ","text-emerald-600"]].map(([l,v,cl]) => (
              <div key={l} className="bg-white rounded-xl p-4 shadow-sm"><p className="text-[12px] text-slate-500">{l}</p><p className={`text-xl font-bold ${cl}`}>{v}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {["ลูกค้า","ยอด","วันที่ซื้อ","กำหนดชำระ","หมายเหตุ","สถานะ",""].map(h => <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>{list.map(c => {
                const od = !c.paid && c.dueDate && new Date(c.dueDate) < new Date();
                return (<tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{c.customer}</td>
                  <td className="px-4 py-3 font-bold text-red-500">{thb(c.amount)} ฿</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(c.date).toLocaleDateString("th-TH")}</td>
                  <td className="px-4 py-3"><span className={od ? "text-red-500 font-medium" : "text-slate-500"}>{c.dueDate ? new Date(c.dueDate).toLocaleDateString("th-TH") : "-"}</span></td>
                  <td className="px-4 py-3 text-slate-400 text-[12px]">{c.note||"-"}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${c.paid?"bg-emerald-100 text-emerald-600":od?"bg-red-100 text-red-500":"bg-amber-100 text-amber-600"}`}>{c.paid?"ชำระแล้ว":od?"เกินกำหนด":"รอชำระ"}</span></td>
                  <td className="px-4 py-3">{!c.paid && <button onClick={() => setList(p=>p.map(x=>x.id===c.id?{...x,paid:true}:x))} className="text-[11px] px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-1"><CheckCircle size={11}/>รับชำระ</button>}</td>
                </tr>);
              })}</tbody>
            </table>
            {list.length===0 && <div className="flex flex-col items-center py-16 text-slate-400 gap-2"><CreditCard size={40} strokeWidth={1}/><p>ยังไม่มีรายการ</p></div>}
          </div>
        </div>
      </main>
    </div>
    {modal && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-lg">บันทึกยอดขายเชื่อ</h2><button onClick={() => setModal(false)} className="text-slate-400"><X size={20}/></button></div>
        <div className="space-y-3">
          <input value={form.customer} onChange={e=>setForm(p=>({...p,customer:e.target.value}))} placeholder="ชื่อลูกค้า" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="ยอดเชื่อ ฿" className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
            <input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder="หมายเหตุ" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
          <button onClick={save} disabled={!form.customer||!form.amount} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">บันทึก</button>
        </div>
      </div>
    </div>}
  </>);
}
