"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import clsx from "clsx";

interface StockMove {
  id: string; date: string; product: string; emoji: string;
  type: "in" | "out" | "adjust"; qty: number; balance: number;
  reason: string; employee: string;
}

const DEMO: StockMove[] = [
  { id:"m1",  date:"15/03/2026 14:30", product:"ครัวซองต์เนย",      emoji:"🥐", type:"out",    qty:-2,   balance:20, reason:"ขาย R001234",         employee:"ชนิ่น" },
  { id:"m2",  date:"15/03/2026 13:15", product:"ชานมไข่มุก",         emoji:"🧋", type:"out",    qty:-1,   balance:49, reason:"ขาย R001233",         employee:"สมหมาย" },
  { id:"m3",  date:"15/03/2026 12:48", product:"เค้กช็อกโกแลต",     emoji:"🎂", type:"out",    qty:-1,   balance:8,  reason:"ขาย R001232",         employee:"ชนิ่น" },
  { id:"m4",  date:"14/03/2026 16:00", product:"แป้งสาลี",           emoji:"🌾", type:"in",     qty:+10,  balance:45, reason:"รับซื้อ PO-0012",     employee:"สมหมาย" },
  { id:"m5",  date:"14/03/2026 15:30", product:"เนยสด",              emoji:"🧈", type:"in",     qty:+5,   balance:12, reason:"รับซื้อ PO-0012",     employee:"สมหมาย" },
  { id:"m6",  date:"14/03/2026 10:00", product:"โดนัทกลาเซ่",        emoji:"🍩", type:"adjust", qty:+3,   balance:18, reason:"ปรับสต็อก",           employee:"ชนิ่น" },
  { id:"m7",  date:"13/03/2026 09:00", product:"กาแฟลาเต้",          emoji:"☕", type:"in",     qty:+20,  balance:50, reason:"รับซื้อ PO-0011",     employee:"ชนิ่น" },
  { id:"m8",  date:"12/03/2026 11:00", product:"มัฟฟินบลูเบอร์รี่",  emoji:"🧁", type:"out",    qty:-8,   balance:12, reason:"ขาย R001225",         employee:"สมหมาย" },
  { id:"m9",  date:"12/03/2026 09:30", product:"น้ำส้มคั้นสด",       emoji:"🍊", type:"adjust", qty:-5,   balance:0,  reason:"ของหมดอายุ",          employee:"ชนิ่น" },
  { id:"m10", date:"11/03/2026 14:00", product:"ขนมปังโฮลวีท",       emoji:"🍞", type:"in",     qty:+10,  balance:15, reason:"รับซื้อ",             employee:"สมหมาย" },
];

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  in:     { label:"รับเข้า",  color:"#10b981", bg:"#f0fdf4", icon:<ArrowUpCircle   size={14} className="text-emerald-500"/> },
  out:    { label:"จ่ายออก", color:"#ef4444", bg:"#fef2f2", icon:<ArrowDownCircle size={14} className="text-red-500"/>     },
  adjust: { label:"ปรับ",    color:"#f59e0b", bg:"#fffbeb", icon:<span className="text-amber-500 text-[14px]">⚙</span>   },
};

export default function StockHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all"|"in"|"out"|"adjust">("all");

  const filtered = DEMO.filter(m =>
    (typeFilter === "all" || m.type === typeFilter) &&
    (search === "" || m.product.includes(search) || m.reason.includes(search))
  );

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <h1 className="text-xl font-bold text-slate-800">ประวัติการเคลื่อนไหวสินค้า</h1>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label:"รับเข้า (วันนี้)",  value:DEMO.filter(m=>m.type==="in"&&m.date.startsWith("15/03")).reduce((s,m)=>s+m.qty,0),   color:"#10b981" },
                { label:"จ่ายออก (วันนี้)", value:Math.abs(DEMO.filter(m=>m.type==="out"&&m.date.startsWith("15/03")).reduce((s,m)=>s+m.qty,0)), color:"#ef4444" },
                { label:"ปรับสต็อก",        value:DEMO.filter(m=>m.type==="adjust").length,                                                color:"#f59e0b" },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500 mb-1">{c.label}</p>
                  <p className="text-[22px] font-bold" style={{ color: c.color }}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินค้า เหตุผล..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-1">
                {([["all","ทั้งหมด"],["in","รับเข้า"],["out","จ่ายออก"],["adjust","ปรับ"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setTypeFilter(v)}
                    className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      typeFilter===v?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}>{l}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่/เวลา</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">ประเภท</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">จำนวน</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">คงเหลือ</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">เหตุผล</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">พนักงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => {
                    const ts = TYPE_STYLE[m.type];
                    return (
                      <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-500 text-[12px]">{m.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{m.emoji}</span>
                            <span className="font-medium text-slate-800">{m.product}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex"
                            style={{ color: ts.color, background: ts.bg }}>
                            {ts.icon}{ts.label}
                          </span>
                        </td>
                        <td className={clsx("px-4 py-3 text-right font-bold", m.qty > 0 ? "text-emerald-500" : m.qty < 0 ? "text-red-500" : "text-slate-500")}>
                          {m.qty > 0 ? `+${m.qty}` : m.qty}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">{m.balance}</td>
                        <td className="px-4 py-3 text-slate-500">{m.reason}</td>
                        <td className="px-4 py-3 text-slate-500">{m.employee}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
