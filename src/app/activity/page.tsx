"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Search } from "lucide-react";

const ACTIVITIES = [
  { id:"a1",  time:"15/03/2026 14:32", user:"ชนิ่น",  action:"ขายสินค้า",           detail:"บิล R001234 ยอด 175.00 ฿",        type:"sale"     },
  { id:"a2",  time:"15/03/2026 14:15", user:"ชนิ่น",  action:"เพิ่มสินค้า",          detail:"เพิ่มสินค้าใหม่: ครัวซองต์เนย",   type:"product"  },
  { id:"a3",  time:"15/03/2026 13:50", user:"สมหมาย", action:"แก้ไขราคาสินค้า",       detail:"กาแฟลาเต้: 60 ฿ → 65 ฿",         type:"product"  },
  { id:"a4",  time:"15/03/2026 13:15", user:"สมหมาย", action:"ขายสินค้า",           detail:"บิล R001233 ยอด 70.00 ฿",          type:"sale"     },
  { id:"a5",  time:"15/03/2026 12:30", user:"ชนิ่น",  action:"เข้าสู่ระบบ",          detail:"จาก 192.168.1.10 (iPad POS #1)",   type:"auth"     },
  { id:"a6",  time:"15/03/2026 11:00", user:"ชนิ่น",  action:"ปรับสต็อก",           detail:"โดนัทกลาเซ่: 15 → 18 ชิ้น",       type:"stock"    },
  { id:"a7",  time:"15/03/2026 10:45", user:"สมหมาย", action:"เบิกสินค้า",           detail:"แป้งสาลี 5 หน่วย, เนยสด 2 หน่วย", type:"stock"    },
  { id:"a8",  time:"15/03/2026 10:00", user:"ชนิ่น",  action:"เพิ่มลูกค้าใหม่",      detail:"มาลี รักชาติ - 088-901-2345",      type:"customer" },
  { id:"a9",  time:"15/03/2026 09:30", user:"สมหมาย", action:"เข้าสู่ระบบ",          detail:"จาก 192.168.1.11 (iPhone)",        type:"auth"     },
  { id:"a10", time:"14/03/2026 17:00", user:"ชนิ่น",  action:"รับสินค้า",           detail:"PO-0012 จาก บจ.เบเกอรี่ซัพพลาย",  type:"stock"    },
];

const TYPE_COLORS: Record<string,{color:string;bg:string;icon:string}> = {
  sale:     { color:"#3b82f6", bg:"#eff6ff",  icon:"💳" },
  product:  { color:"#8b5cf6", bg:"#f5f3ff",  icon:"📦" },
  stock:    { color:"#f59e0b", bg:"#fffbeb",  icon:"🗃️" },
  auth:     { color:"#10b981", bg:"#f0fdf4",  icon:"🔐" },
  customer: { color:"#ec4899", bg:"#fdf2f8",  icon:"👤" },
};

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = ACTIVITIES.filter(a =>
    (typeFilter==="all"||a.type===typeFilter) &&
    (search===""||a.action.includes(search)||a.detail.includes(search)||a.user.includes(search))
  );

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">บันทึกกิจกรรม</h1>

        <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหากิจกรรม..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <div className="flex gap-1 flex-wrap">
            {[["all","ทั้งหมด"],["sale","ขาย"],["product","สินค้า"],["stock","สต็อก"],["auth","เข้าสู่ระบบ"],["customer","ลูกค้า"]].map(([v,l]) => (
              <button key={v} onClick={()=>setTypeFilter(v)}
                className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${typeFilter===v?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map(a => {
            const ts = TYPE_COLORS[a.type] ?? { color:"#94a3b8", bg:"#f8fafc", icon:"📋" };
            return (
              <div key={a.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
                <span className="text-xl flex-shrink-0">{ts.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{a.action}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color:ts.color, background:ts.bg }}>
                      {a.user}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400 truncate">{a.detail}</p>
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
