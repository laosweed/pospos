"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Plus, Edit2 } from "lucide-react";

interface Level { id:string; name:string; color:string; discount:number; minPoints:number; members:number }

const DEMO: Level[] = [
  { id:"l1", name:"ทั่วไป",      color:"#94a3b8", discount:0,  minPoints:0,    members:120 },
  { id:"l2", name:"ทองแดง",     color:"#b45309", discount:5,  minPoints:100,  members:45  },
  { id:"l3", name:"เงิน",        color:"#64748b", discount:10, minPoints:500,  members:28  },
  { id:"l4", name:"ทอง",         color:"#f59e0b", discount:15, minPoints:1000, members:12  },
  { id:"l5", name:"เพชร",        color:"#06b6d4", discount:20, minPoints:5000, members:3   },
];

export default function PriceLevelsPage() {
  const [levels] = useState(DEMO);

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">ระดับราคา / ระดับสมาชิก</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> เพิ่มระดับ
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {levels.map(l => (
            <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                style={{ background: l.color }}>
                {l.name[0]}
              </div>
              <p className="font-bold text-slate-800">{l.name}</p>
              <p className="text-[22px] font-bold mt-1" style={{ color:l.color }}>
                {l.discount > 0 ? `${l.discount}%` : "-"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">ส่วนลด</p>
              <p className="text-[12px] text-slate-500 mt-2">{l.minPoints.toLocaleString()} แต้มขึ้นไป</p>
              <p className="text-[11px] text-slate-400">{l.members} สมาชิก</p>
              <button className="mt-3 p-1.5 text-slate-400 hover:text-blue-500 rounded-lg">
                <Edit2 size={13}/>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b font-semibold text-slate-700">เปรียบเทียบสิทธิประโยชน์</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 text-slate-500 font-medium">ระดับ</th>
                <th className="text-center px-4 py-2.5 text-slate-500 font-medium">แต้มขั้นต่ำ</th>
                <th className="text-center px-4 py-2.5 text-slate-500 font-medium">ส่วนลด</th>
                <th className="text-center px-4 py-2.5 text-slate-500 font-medium">จำนวนสมาชิก</th>
              </tr>
            </thead>
            <tbody>
              {levels.map(l => (
                <tr key={l.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background:l.color }}/>
                      <span className="font-medium">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{l.minPoints.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color:l.color }}>
                    {l.discount > 0 ? `${l.discount}%` : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">{l.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
