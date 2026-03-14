"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";
import clsx from "clsx";

const CHANNELS = [
  { id:"lazada",   name:"Lazada",   icon:"🛒", connected:true,  orders:45, revenue:28500, color:"#0f146d" },
  { id:"shopee",   name:"Shopee",   icon:"🛍️", connected:true,  orders:82, revenue:52000, color:"#ee4d2d" },
  { id:"line",     name:"LINE Shop",icon:"💚", connected:false, orders:0,  revenue:0,     color:"#06c755" },
  { id:"facebook", name:"Facebook", icon:"📘", connected:false, orders:0,  revenue:0,     color:"#1877f2" },
];

const ORDERS = [
  { id:"o1", channel:"Shopee",  orderNo:"2403150001", customer:"สมชาย ใจดี",   items:"ครัวซองต์×5",      total:225, status:"packed"  },
  { id:"o2", channel:"Lazada",  orderNo:"LAZ0045",    customer:"นารี มีสุข",   items:"เค้กช็อกโกแลต×1", total:180, status:"pending" },
  { id:"o3", channel:"Shopee",  orderNo:"2403150002", customer:"วิชัย ทองดี",  items:"กาแฟ×10 ชุด",      total:650, status:"shipped" },
];

const ORDER_STATUS: Record<string,{label:string;color:string;bg:string}> = {
  pending: { label:"รอดำเนินการ", color:"#f59e0b", bg:"#fffbeb" },
  packed:  { label:"แพ็คแล้ว",   color:"#8b5cf6", bg:"#f5f3ff" },
  shipped: { label:"จัดส่งแล้ว", color:"#10b981", bg:"#f0fdf4" },
};

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function EcomPage() {
  const [tab, setTab] = useState<"overview"|"orders">("overview");

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">อีคอมเมิร์ซ</h1>

        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
          {(["overview","orders"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)}
              className={clsx("px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                tab===t?"bg-blue-600 text-white":"text-slate-600 hover:bg-slate-100"
              )}>
              {t==="overview"?"ภาพรวม":"ออเดอร์"}
            </button>
          ))}
        </div>

        {tab==="overview" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {CHANNELS.map(ch => (
                <div key={ch.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ch.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-800">{ch.name}</p>
                        <span className={clsx("text-[11px] font-medium px-2 py-0.5 rounded-full",
                          ch.connected?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500"
                        )}>
                          {ch.connected?"เชื่อมต่อแล้ว":"ยังไม่เชื่อมต่อ"}
                        </span>
                      </div>
                    </div>
                    <button className={clsx("px-3 py-1.5 rounded-xl text-[12px] font-medium",
                      ch.connected?"border border-slate-200 text-slate-600":"bg-blue-600 text-white hover:bg-blue-700"
                    )}>
                      {ch.connected?"จัดการ":"เชื่อมต่อ"}
                    </button>
                  </div>
                  {ch.connected ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[11px] text-slate-400">ออเดอร์</p>
                        <p className="font-bold text-slate-700">{ch.orders} รายการ</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[11px] text-slate-400">ยอดขาย</p>
                        <p className="font-bold text-blue-600">{thb(ch.revenue)} ฿</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-400 text-center py-2">เชื่อมต่อเพื่อซิงค์ออเดอร์อัตโนมัติ</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="orders" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">ช่องทาง</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">เลขออเดอร์</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">ลูกค้า</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอด</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map(o => {
                  const st = ORDER_STATUS[o.status];
                  const ch = CHANNELS.find(c=>c.name===o.channel);
                  return (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-sm">{ch?.icon} {o.channel}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-blue-600">{o.orderNo}</td>
                      <td className="px-4 py-3 text-slate-700">{o.customer}</td>
                      <td className="px-4 py-3 text-slate-500">{o.items}</td>
                      <td className="px-4 py-3 text-right font-semibold">{thb(o.total)} ฿</td>
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
        )}
      </div>
    </PageShell>
  );
}
