"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, X, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Credit {
  id: string; customer: string; phone: string; date: string;
  dueDate: string; amount: number; paid: number; description: string;
}

const DEMO: Credit[] = [
  { id:"cr1", customer:"สมชาย ใจดี",    phone:"081-234-5678", date:"01/03/2026", dueDate:"31/03/2026", amount:1500, paid:500,  description:"ค่าขนมปังและเบเกอรี่" },
  { id:"cr2", customer:"นารี มีสุข",    phone:"082-345-6789", date:"10/02/2026", dueDate:"10/03/2026", amount:800,  paid:800,  description:"เค้กวันเกิด"           },
  { id:"cr3", customer:"วิชัย ทองดี",   phone:"083-456-7890", date:"15/02/2026", dueDate:"15/03/2026", amount:2200, paid:0,    description:"ค่าขนมจัดเลี้ยง"      },
  { id:"cr4", customer:"ประภา จันทร์",  phone:"084-567-8901", date:"20/03/2026", dueDate:"20/04/2026", amount:600,  paid:200,  description:"ของว่างรายเดือน"       },
];

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function CreditPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [credits, setCredits] = useState(DEMO);
  const [paying, setPaying] = useState<Credit|null>(null);
  const [payAmount, setPayAmount] = useState("");

  const totalCredit = credits.reduce((s,c)=>s+(c.amount-c.paid),0);
  const overdue = credits.filter(c=>{
    const [d,m,y]=c.dueDate.split("/").map(Number);
    return new Date(y,m-1,d)<new Date() && c.paid<c.amount;
  });

  const handlePay = () => {
    const amt = parseFloat(payAmount);
    if (!paying || isNaN(amt) || amt<=0) return;
    setCredits(prev=>prev.map(c=>c.id===paying.id?{...c,paid:Math.min(c.paid+amt,c.amount)}:c));
    setPaying(null); setPayAmount("");
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ค้างจ่าย (หนี้ลูกค้า)</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> เพิ่มรายการ
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">หนี้ค้างทั้งหมด</p>
                <p className="text-[22px] font-bold text-red-500">{thb(totalCredit)} ฿</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">เกินกำหนด</p>
                <p className="text-[22px] font-bold text-amber-500">{overdue.length} ราย</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ชำระแล้วทั้งหมด</p>
                <p className="text-[22px] font-bold text-emerald-600">{thb(credits.reduce((s,c)=>s+c.paid,0))} ฿</p>
              </div>
            </div>

            <div className="space-y-3">
              {credits.map(c => {
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800">{c.customer}</span>
                          {isOverdue && <AlertCircle size={14} className="text-red-400" />}
                          {isPaid && <span className="text-[11px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">ชำระแล้ว</span>}
                        </div>
                        <p className="text-[12px] text-slate-500">{c.phone} · {c.description}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">ครบกำหนด {c.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-500">{thb(remaining)} ฿</p>
                        <p className="text-[12px] text-slate-400">ชำระแล้ว {thb(c.paid)} / {thb(c.amount)} ฿</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-emerald-400 transition-all" style={{ width:`${pct}%` }} />
                      </div>
                    </div>
                    {!isPaid && (
                      <button onClick={() => { setPaying(c); setPayAmount(""); }}
                        className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[13px] font-medium hover:bg-blue-700">
                        รับชำระเงิน
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {paying && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">รับชำระเงิน</h2>
              <button onClick={()=>setPaying(null)} className="text-slate-400"><X size={20}/></button>
            </div>
            <p className="text-sm text-slate-600 mb-1">{paying.customer}</p>
            <p className="text-sm text-slate-400 mb-4">ยอดค้างชำระ: <span className="font-bold text-red-500">{thb(paying.amount-paying.paid)} ฿</span></p>
            <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="จำนวนเงินที่รับ"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-blue-400" />
            <div className="flex gap-2">
              <button onClick={()=>setPaying(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600">ยกเลิก</button>
              <button onClick={handlePay} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
