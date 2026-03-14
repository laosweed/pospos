"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Plus, X } from "lucide-react";
import clsx from "clsx";

interface Creditor {
  id: string; name: string; phone: string; dueDate: string;
  amount: number; paid: number; description: string;
}

const DEMO: Creditor[] = [
  { id:"c1", name:"บจ.เบเกอรี่ซัพพลาย",   phone:"02-123-4567", dueDate:"31/03/2026", amount:12500, paid:5000,  description:"วัตถุดิบเดือนมีนาคม" },
  { id:"c2", name:"ร้านวัตถุดิบไทย",       phone:"02-234-5678", dueDate:"25/03/2026", amount:4800,  paid:4800,  description:"แป้ง น้ำตาล" },
  { id:"c3", name:"บจ.นมสดและผลิตภัณฑ์",   phone:"02-345-6789", dueDate:"20/03/2026", amount:8200,  paid:0,     description:"นม ครีม เนย" },
  { id:"c4", name:"ฟาร์มไก่ไทยเนเจอรัล",   phone:"02-456-7890", dueDate:"28/03/2026", amount:3600,  paid:1800,  description:"ไข่ไก่ 3 แผง" },
];

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function CreditorPage() {
  const [creditors, setCreditors] = useState(DEMO);
  const [paying, setPaying] = useState<Creditor|null>(null);
  const [amount, setAmount] = useState("");

  const totalOwed = creditors.reduce((s,c) => s+(c.amount-c.paid),0);

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!paying || isNaN(amt) || amt<=0) return;
    setCreditors(prev => prev.map(c => c.id===paying.id ? {...c, paid:Math.min(c.paid+amt,c.amount)} : c));
    setPaying(null); setAmount("");
  };

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">เจ้าหนี้ (บัญชีที่ต้องจ่าย)</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> เพิ่มรายการ
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">ยอดค้างจ่ายทั้งหมด</p>
            <p className="text-[22px] font-bold text-red-500">{thb(totalOwed)} ฿</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">จ่ายแล้ว</p>
            <p className="text-[22px] font-bold text-emerald-600">{thb(creditors.reduce((s,c)=>s+c.paid,0))} ฿</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">รายการ</p>
            <p className="text-[22px] font-bold text-blue-600">{creditors.length} ราย</p>
          </div>
        </div>

        <div className="space-y-3">
          {creditors.map(c => {
            const remaining = c.amount - c.paid;
            const pct = (c.paid/c.amount)*100;
            const isPaid = remaining <= 0;
            const [d,m,y] = c.dueDate.split("/").map(Number);
            const isOverdue = new Date(y,m-1,d) < new Date() && !isPaid;
            return (
              <div key={c.id} className={clsx("bg-white rounded-2xl p-4 shadow-sm border-l-4",
                isPaid?"border-emerald-400":isOverdue?"border-red-400":"border-amber-400"
              )}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p className="text-[12px] text-slate-500">{c.phone} · {c.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">ครบกำหนด {c.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-500">{thb(remaining)} ฿</p>
                    <p className="text-[12px] text-slate-400">จ่ายแล้ว {thb(c.paid)} / {thb(c.amount)} ฿</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width:`${pct}%` }} />
                </div>
                {!isPaid && (
                  <button onClick={() => { setPaying(c); setAmount(""); }}
                    className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[13px] font-medium hover:bg-blue-700">
                    บันทึกการจ่าย
                  </button>
                )}
                {isPaid && <span className="mt-2 inline-block text-[11px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">จ่ายครบแล้ว</span>}
              </div>
            );
          })}
        </div>
      </div>
      {paying && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">บันทึกการจ่ายเงิน</h2>
              <button onClick={()=>setPaying(null)}><X size={20} className="text-slate-400"/></button>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">{paying.name}</p>
            <p className="text-sm text-slate-400 mb-4">ค้างชำระ: <span className="font-bold text-red-500">{thb(paying.amount-paying.paid)} ฿</span></p>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="จำนวนเงินที่จ่าย"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-blue-400"/>
            <div className="flex gap-2">
              <button onClick={()=>setPaying(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600">ยกเลิก</button>
              <button onClick={handlePay} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
