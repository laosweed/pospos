"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { AlertTriangle, Plus } from "lucide-react";
import clsx from "clsx";

interface ExpiryItem {
  id:string; name:string; emoji:string; batch:string; qty:number;
  expiryDate:string; daysLeft:number;
}

const today = new Date();
function daysFromNow(d:string) {
  const [day,m,y] = d.split("/").map(Number);
  return Math.ceil((new Date(y,m-1,day).getTime()-today.getTime())/(1000*60*60*24));
}

const DEMO: ExpiryItem[] = [
  { id:"e1", name:"นมสด",             emoji:"🥛", batch:"LOT-231", qty:12, expiryDate:"16/03/2026", daysLeft:1  },
  { id:"e2", name:"ครีมสด",           emoji:"🫙", batch:"LOT-232", qty:5,  expiryDate:"17/03/2026", daysLeft:2  },
  { id:"e3", name:"ไข่ไก่",           emoji:"🥚", batch:"LOT-228", qty:30, expiryDate:"20/03/2026", daysLeft:5  },
  { id:"e4", name:"เนยสด",            emoji:"🧈", batch:"LOT-220", qty:8,  expiryDate:"31/03/2026", daysLeft:16 },
  { id:"e5", name:"ชีสเค้ก (แช่เย็น)",emoji:"🍰", batch:"LOT-240", qty:4,  expiryDate:"15/03/2026", daysLeft:0  },
  { id:"e6", name:"บลูเบอร์รี่สด",    emoji:"🫐", batch:"LOT-241", qty:2,  expiryDate:"14/03/2026", daysLeft:-1 },
  { id:"e7", name:"แป้งสาลี",         emoji:"🌾", batch:"LOT-190", qty:20, expiryDate:"30/06/2026", daysLeft:107},
];

function statusOf(days:number) {
  if (days < 0) return { label:"หมดอายุแล้ว", color:"#ef4444", bg:"#fef2f2" };
  if (days === 0) return { label:"หมดอายุวันนี้", color:"#ef4444", bg:"#fef2f2" };
  if (days <= 3)  return { label:`อีก ${days} วัน`, color:"#f59e0b", bg:"#fffbeb" };
  if (days <= 7)  return { label:`อีก ${days} วัน`, color:"#f97316", bg:"#fff7ed" };
  return { label:`อีก ${days} วัน`, color:"#10b981", bg:"#f0fdf4" };
}

export default function ExpirationPage() {
  const [filter, setFilter] = useState<"all"|"critical"|"warning">("all");

  const filtered = DEMO.filter(i =>
    filter==="all" || (filter==="critical" && i.daysLeft<=1) || (filter==="warning" && i.daysLeft<=7)
  );

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">วันหมดอายุสินค้า</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> เพิ่มสินค้า
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label:"หมดอายุแล้ว/วันนี้", value:DEMO.filter(i=>i.daysLeft<=0).length, color:"#ef4444" },
            { label:"เกือบหมดอายุ (≤7 วัน)", value:DEMO.filter(i=>i.daysLeft>0&&i.daysLeft<=7).length, color:"#f59e0b" },
            { label:"ปกติ", value:DEMO.filter(i=>i.daysLeft>7).length, color:"#10b981" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-[12px] text-slate-500 mb-1">{c.label}</p>
              <p className="text-[22px] font-bold" style={{ color:c.color }}>{c.value} รายการ</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {([["all","ทั้งหมด"],["critical","วิกฤต (≤1 วัน)"],["warning","เตือน (≤7 วัน)"]] as const).map(([v,l]) => (
            <button key={v} onClick={()=>setFilter(v)}
              className={clsx("px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                filter===v?"bg-blue-600 text-white":"bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
              )}>{l}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Lot/Batch</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">จำนวน</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">วันหมดอายุ</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a,b)=>a.daysLeft-b.daysLeft).map(item => {
                const st = statusOf(item.daysLeft);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.daysLeft <= 1 && <AlertTriangle size={13} className="text-red-400 flex-shrink-0"/>}
                        <span className="text-xl">{item.emoji}</span>
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate-400">{item.batch}</td>
                    <td className="px-4 py-3 text-right">{item.qty} ชิ้น</td>
                    <td className="px-4 py-3 text-center text-slate-600">{item.expiryDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color:st.color, background:st.bg }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
