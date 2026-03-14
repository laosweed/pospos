"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import clsx from "clsx";

type TableStatus = "empty" | "occupied" | "bill" | "reserved";

interface Table {
  id: string; name: string; seats: number; status: TableStatus;
  order?: { items: string[]; total: number; since: string };
  reservedFor?: string;
}

const INITIAL: Table[] = [
  { id:"t1",  name:"โต๊ะ 1", seats:2, status:"occupied",  order:{ items:["กาแฟลาเต้","ครัวซองต์เนย"], total:110, since:"13:15" } },
  { id:"t2",  name:"โต๊ะ 2", seats:4, status:"bill",      order:{ items:["ชีสเค้ก","ชานมไข่มุก","เค้กช็อกโกแลต"], total:300, since:"12:30" } },
  { id:"t3",  name:"โต๊ะ 3", seats:2, status:"empty" },
  { id:"t4",  name:"โต๊ะ 4", seats:6, status:"reserved",  reservedFor:"สมชาย 15:00" },
  { id:"t5",  name:"โต๊ะ 5", seats:4, status:"occupied",  order:{ items:["แซนวิชทูน่า","น้ำส้มคั้น"], total:140, since:"13:45" } },
  { id:"t6",  name:"โต๊ะ 6", seats:2, status:"empty" },
  { id:"t7",  name:"โต๊ะ 7", seats:4, status:"occupied",  order:{ items:["โดนัท×3","กาแฟ×2"], total:250, since:"14:00" } },
  { id:"t8",  name:"โต๊ะ 8", seats:8, status:"empty" },
];

const STATUS_STYLE: Record<TableStatus,{ label:string; bg:string; text:string; border:string }> = {
  empty:    { label:"ว่าง",       bg:"#f0fdf4", text:"#10b981", border:"#bbf7d0" },
  occupied: { label:"มีลูกค้า",   bg:"#eff6ff", text:"#3b82f6", border:"#bfdbfe" },
  bill:     { label:"เรียกบิล",   bg:"#fffbeb", text:"#f59e0b", border:"#fde68a" },
  reserved: { label:"จอง",        bg:"#f5f3ff", text:"#8b5cf6", border:"#ddd6fe" },
};

export default function TableMonitorPage() {
  const [tables, setTables] = useState(INITIAL);
  const [selected, setSelected] = useState<Table|null>(null);

  const counts = {
    empty: tables.filter(t=>t.status==="empty").length,
    occupied: tables.filter(t=>t.status==="occupied").length,
    bill: tables.filter(t=>t.status==="bill").length,
    reserved: tables.filter(t=>t.status==="reserved").length,
  };

  const clear = (id: string) => {
    setTables(prev => prev.map(t => t.id===id ? {...t, status:"empty", order:undefined, reservedFor:undefined} : t));
    setSelected(null);
  };

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">มอนิเตอร์โต๊ะ</h1>

        <div className="grid grid-cols-4 gap-3">
          {Object.entries(counts).map(([status,count]) => {
            const st = STATUS_STYLE[status as TableStatus];
            return (
              <div key={status} className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderLeftColor:st.text }}>
                <p className="text-[12px] text-slate-500">{st.label}</p>
                <p className="text-[22px] font-bold" style={{ color:st.text }}>{count} โต๊ะ</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {tables.map(table => {
            const st = STATUS_STYLE[table.status];
            return (
              <button key={table.id} onClick={() => setSelected(table)}
                className="rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow border-2"
                style={{ background:st.bg, borderColor:st.border }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-slate-800 text-lg">{table.name}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color:st.text, background:"white" }}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 mb-2">{table.seats} ที่นั่ง</p>
                {table.order && (
                  <>
                    <p className="text-[12px] text-slate-600 mb-1">{table.order.items.slice(0,2).join(", ")}{table.order.items.length>2?`...`:""}</p>
                    <p className="text-[14px] font-bold" style={{ color:st.text }}>{table.order.total} ฿</p>
                    <p className="text-[11px] text-slate-400">ตั้งแต่ {table.order.since}</p>
                  </>
                )}
                {table.reservedFor && (
                  <p className="text-[12px] text-purple-600 font-medium">{table.reservedFor}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[340px] p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-3">{selected.name}</h2>
            {selected.order ? (
              <>
                <div className="space-y-1 mb-4">
                  {selected.order.items.map((item,i)=>(
                    <p key={i} className="text-sm text-slate-700">• {item}</p>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>ยอดรวม</span><span className="text-blue-600">{selected.order.total} ฿</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setSelected(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">ปิด</button>
                  <button onClick={()=>clear(selected.id)} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700">เก็บโต๊ะ</button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400 mb-4">โต๊ะ{STATUS_STYLE[selected.status].label}</p>
                <button onClick={()=>setSelected(null)} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">ปิด</button>
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
