"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Plus, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import clsx from "clsx";

type ReqType = "withdraw" | "return";

interface Requisition {
  id: string; date: string; employee: string; type: ReqType;
  items: { name: string; emoji: string; qty: number }[];
  reason: string; status: "approved"|"pending"|"rejected";
}

const DEMO: Requisition[] = [
  { id:"r1", date:"15/03/2026 10:00", employee:"ชนิ่น",  type:"withdraw", items:[{name:"แป้งสาลี",emoji:"🌾",qty:5},{name:"เนยสด",emoji:"🧈",qty:2}], reason:"เปิดร้านประจำวัน", status:"approved" },
  { id:"r2", date:"14/03/2026 16:30", employee:"สมหมาย", type:"return",   items:[{name:"กาแฟเมล็ด",emoji:"☕",qty:1}], reason:"สินค้าเหลือจากวัน", status:"approved" },
  { id:"r3", date:"14/03/2026 09:00", employee:"วันดี",  type:"withdraw", items:[{name:"น้ำตาล",emoji:"🍬",qty:3},{name:"นมสด",emoji:"🥛",qty:4}], reason:"เตรียมเครื่องดื่ม", status:"approved" },
  { id:"r4", date:"15/03/2026 14:00", employee:"สุพรรณ", type:"withdraw", items:[{name:"ช็อกโกแลต",emoji:"🍫",qty:2}], reason:"ทำเค้กพิเศษ", status:"pending" },
];

const STATUS_STYLE = {
  approved: { label:"อนุมัติ", color:"#10b981", bg:"#f0fdf4" },
  pending:  { label:"รออนุมัติ", color:"#f59e0b", bg:"#fffbeb" },
  rejected: { label:"ไม่อนุมัติ", color:"#ef4444", bg:"#fef2f2" },
};

export default function RequisitionPage() {
  const [tab, setTab] = useState<"list"|"new">("list");
  const [type, setType] = useState<ReqType>("withdraw");
  const [reason, setReason] = useState("");
  const [reqs] = useState(DEMO);

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">เบิก / คืนสินค้า</h1>
          <button onClick={() => setTab(tab==="list"?"new":"list")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            {tab==="new" ? "← รายการ" : <><Plus size={15}/>สร้างใบเบิก</>}
          </button>
        </div>

        {tab === "list" ? (
          <div className="space-y-3">
            {reqs.map(req => {
              const st = STATUS_STYLE[req.status];
              return (
                <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {req.type==="withdraw"
                        ? <ArrowDownCircle size={18} className="text-red-400" />
                        : <ArrowUpCircle size={18} className="text-emerald-400" />}
                      <div>
                        <span className="font-semibold text-slate-800">
                          {req.type==="withdraw"?"เบิกสินค้า":"คืนสินค้า"}
                        </span>
                        <span className="text-[12px] text-slate-400 ml-2">{req.date}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color:st.color, background:st.bg }}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {req.items.map((item,i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 text-[12px] px-2 py-1 rounded-lg">
                        {item.emoji} {item.name} ×{item.qty}
                      </span>
                    ))}
                  </div>
                  <p className="text-[12px] text-slate-500">พนักงาน: {req.employee} · เหตุผล: {req.reason}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 max-w-lg">
            <div className="flex gap-2">
              {(["withdraw","return"] as ReqType[]).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={clsx("flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    type===t?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"
                  )}>
                  {t==="withdraw"?"เบิกสินค้า":"คืนสินค้า"}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">เหตุผล</label>
              <input value={reason} onChange={e=>setReason(e.target.value)}
                placeholder="ระบุเหตุผล..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <p className="text-sm text-slate-400 text-center py-4">เพิ่มรายการสินค้าที่ต้องการ{type==="withdraw"?"เบิก":"คืน"}</p>
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
              ส่งคำขอ
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
