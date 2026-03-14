"use client";

import PageShell from "@/components/PageShell";
import { Monitor, Plus, Wifi, WifiOff } from "lucide-react";
import clsx from "clsx";

const MACHINES = [
  { id:"m1", name:"POS #1 - สุขุมวิท", branch:"สาขาสุขุมวิท", serial:"POS-2024-001", model:"POSPOS Pro X", online:true,  lastSeen:"เมื่อกี้",          sales:285, revenue:98500 },
  { id:"m2", name:"POS #2 - สุขุมวิท", branch:"สาขาสุขุมวิท", serial:"POS-2024-002", model:"POSPOS Pro X", online:true,  lastSeen:"เมื่อกี้",          sales:198, revenue:72000 },
  { id:"m3", name:"POS #1 - สีลม",     branch:"สาขาสีลม",     serial:"POS-2024-003", model:"POSPOS Pro X", online:false, lastSeen:"1 ชั่วโมงที่แล้ว", sales:150, revenue:55000 },
  { id:"m4", name:"POS #1 - อโศก",     branch:"สาขาอโศก",     serial:"POS-2024-004", model:"POSPOS Pro X", online:true,  lastSeen:"เมื่อกี้",          sales:220, revenue:84000 },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function PosMachinesPage() {
  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">เครื่อง POS</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> เพิ่มเครื่อง
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MACHINES.map(m => (
            <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Monitor size={24} className="text-slate-600"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{m.name}</h3>
                    <p className="text-[12px] text-slate-400">{m.model}</p>
                  </div>
                </div>
                <div className={clsx("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full",
                  m.online?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500"
                )}>
                  {m.online ? <Wifi size={10}/> : <WifiOff size={10}/>}
                  {m.online ? "ออนไลน์" : "ออฟไลน์"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px] text-slate-500 mb-4">
                <div><span className="text-slate-400">สาขา: </span>{m.branch}</div>
                <div><span className="text-slate-400">Serial: </span><span className="font-mono">{m.serial}</span></div>
                <div><span className="text-slate-400">ออนไลน์ล่าสุด: </span>{m.lastSeen}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex justify-between">
                <div><p className="text-[11px] text-slate-400">บิลเดือนนี้</p><p className="font-bold text-slate-700">{m.sales} บิล</p></div>
                <div className="text-right"><p className="text-[11px] text-slate-400">ยอดขาย</p><p className="font-bold text-blue-600">{thb(m.revenue)} ฿</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
