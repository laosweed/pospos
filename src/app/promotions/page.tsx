"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Gift, X } from "lucide-react";
import clsx from "clsx";

interface Promo {
  id: string; name: string; type: string; value: number; minOrder: number;
  startDate: string; endDate: string; active: boolean; used: number; limit: number;
}

const DEMO: Promo[] = [
  { id:"pr1", name:"ลด 20% สำหรับสมาชิก", type:"percent", value:20, minOrder:200, startDate:"01/03/2026", endDate:"31/03/2026", active:true,  used:45, limit:100 },
  { id:"pr2", name:"ซื้อครบ 500 ลด 50฿",  type:"fixed",   value:50, minOrder:500, startDate:"01/03/2026", endDate:"31/03/2026", active:true,  used:18, limit:50  },
  { id:"pr3", name:"วันเกิดลด 15%",        type:"percent", value:15, minOrder:0,   startDate:"01/01/2026", endDate:"31/12/2026", active:true,  used:8,  limit:999 },
  { id:"pr4", name:"Flash Sale ลดพิเศษ",   type:"percent", value:30, minOrder:100, startDate:"10/02/2026", endDate:"28/02/2026", active:false, used:62, limit:200 },
];

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

export default function PromotionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promos, setPromos] = useState(DEMO);

  const toggleActive = (id: string) => {
    setPromos(prev => prev.map(p => p.id===id ? {...p, active:!p.active} : p));
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">โปรโมชั่น</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> สร้างโปรโมชั่น
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">โปรโมชั่นทั้งหมด</p>
                <p className="text-[22px] font-bold text-blue-600">{promos.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">กำลังใช้งาน</p>
                <p className="text-[22px] font-bold text-emerald-600">{promos.filter(p=>p.active).length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ใช้แล้วทั้งหมด</p>
                <p className="text-[22px] font-bold text-purple-600">{promos.reduce((s,p)=>s+p.used,0)} ครั้ง</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {promos.map(promo => (
                <div key={promo.id} className={clsx("bg-white rounded-2xl p-5 shadow-sm border-2 transition-all", promo.active?"border-emerald-200":"border-slate-100 opacity-60")}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                        <Gift size={18} className="text-pink-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{promo.name}</h3>
                        <span className={clsx("text-[11px] font-medium px-2 py-0.5 rounded-full",
                          promo.type==="percent"?"bg-blue-50 text-blue-600":"bg-purple-50 text-purple-600"
                        )}>
                          {promo.type==="percent"?`ลด ${promo.value}%`:`ลด ${thb(promo.value)} ฿`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className={clsx("w-11 h-6 rounded-full relative transition-colors flex-shrink-0", promo.active?"bg-emerald-500":"bg-slate-300")}
                    >
                      <div className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", promo.active?"left-5":"left-0.5")} />
                    </button>
                  </div>
                  <div className="text-[12px] text-slate-500 space-y-1">
                    {promo.minOrder > 0 && <p>ขั้นต่ำ {thb(promo.minOrder)} ฿</p>}
                    <p>{promo.startDate} – {promo.endDate}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-pink-400" style={{ width:`${Math.min((promo.used/promo.limit)*100,100)}%` }} />
                      </div>
                      <span className="text-[11px]">{promo.used}/{promo.limit} ครั้ง</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
