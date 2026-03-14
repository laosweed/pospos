"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Trash2, Tag } from "lucide-react";
import clsx from "clsx";

interface Discount {
  id: string; name: string; code: string; type: "percent"|"fixed";
  value: number; minOrder: number; active: boolean; used: number;
}

const DEMO: Discount[] = [
  { id:"d1", name:"ลูกค้าใหม่",     code:"NEW20",    type:"percent", value:20, minOrder:0,   active:true,  used:32 },
  { id:"d2", name:"สมาชิก VIP",     code:"VIP15",    type:"percent", value:15, minOrder:300, active:true,  used:78 },
  { id:"d3", name:"ลด 50 บาท",      code:"SAVE50",   type:"fixed",   value:50, minOrder:500, active:true,  used:15 },
  { id:"d4", name:"Flash Sale",     code:"FLASH30",  type:"percent", value:30, minOrder:0,   active:false, used:44 },
  { id:"d5", name:"ส่วนลดพนักงาน", code:"STAFF10",  type:"percent", value:10, minOrder:0,   active:true,  used:120 },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function DiscountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [discounts, setDiscounts] = useState(DEMO);

  const toggle = (id: string) => setDiscounts(prev => prev.map(d => d.id===id?{...d,active:!d.active}:d));
  const remove = (id: string) => setDiscounts(prev => prev.filter(d=>d.id!==id));

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ส่วนลด / คูปอง</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> สร้างส่วนลด
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ชื่อส่วนลด</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">โค้ด</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ประเภท</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">ขั้นต่ำ</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">ใช้แล้ว</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {discounts.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-pink-400" />
                          <span className="font-medium text-slate-800">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">{d.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx("text-[12px] font-semibold", d.type==="percent"?"text-blue-600":"text-purple-600")}>
                          {d.type==="percent"?`ลด ${d.value}%`:`ลด ${thb(d.value)} ฿`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{d.minOrder>0?`${thb(d.minOrder)} ฿`:"-"}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{d.used} ครั้ง</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggle(d.id)}
                          className={clsx("w-11 h-6 rounded-full relative transition-colors inline-flex", d.active?"bg-emerald-500":"bg-slate-300")}>
                          <div className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", d.active?"left-5":"left-0.5")} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => remove(d.id)} className="p-1.5 text-slate-300 hover:text-red-400 rounded-lg"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
