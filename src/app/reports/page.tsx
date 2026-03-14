"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import clsx from "clsx";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const WEEKLY_DATA = [
  { day:"จ", revenue:4200, bills:18, cost:1800 },
  { day:"อ", revenue:5800, bills:24, cost:2400 },
  { day:"พ", revenue:3900, bills:16, cost:1600 },
  { day:"พฤ",revenue:7200, bills:30, cost:3000 },
  { day:"ศ", revenue:8500, bills:35, cost:3500 },
  { day:"ส", revenue:12000,bills:48, cost:5000 },
  { day:"อา",revenue:9500, bills:40, cost:4000 },
];

const MONTHLY_DATA = Array.from({length:15},(_,i)=>({
  day:`${i+1}`,
  revenue: 3000 + Math.random()*8000,
  cost: 1200 + Math.random()*3000,
}));

const CATEGORY_DATA = [
  { name:"เบเกอรี่",    value:38, color:"#3b82f6" },
  { name:"เครื่องดื่ม", value:28, color:"#06b6d4" },
  { name:"เค้ก",        value:18, color:"#8b5cf6" },
  { name:"อาหาร",       value:10, color:"#10b981" },
  { name:"อื่นๆ",       value:6,  color:"#f59e0b" },
];

const TOP_PRODUCTS = [
  { name:"กาแฟลาเต้",     sold:120, revenue:7800,  emoji:"☕" },
  { name:"ชานมไข่มุก",    sold:98,  revenue:6860,  emoji:"🧋" },
  { name:"ครัวซองต์เนย", sold:85,  revenue:3825,  emoji:"🥐" },
  { name:"เค้กช็อกโกแลต",sold:42,  revenue:7560,  emoji:"🎂" },
  { name:"มัฟฟินบลูเบอร์รี่",sold:76,revenue:4180,emoji:"🧁" },
];

type Period = "week" | "month";

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState<Period>("week");

  const data = period === "week" ? WEEKLY_DATA : MONTHLY_DATA;
  const totalRevenue = data.reduce((s,d)=>s+(d.revenue??0),0);
  const totalCost    = data.reduce((s,d)=>s+(d.cost??0),0);
  const grossProfit  = totalRevenue - totalCost;
  const totalBills   = WEEKLY_DATA.reduce((s,d)=>s+d.bills,0);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">รายงาน</h1>
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                {(["week","month"] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      period === p ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {p === "week" ? "สัปดาห์นี้" : "เดือนนี้"}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label:"ยอดขายรวม",    value:thb(totalRevenue)+" ฿", sub:"+12.5% vs ก่อนหน้า", color:"#3b82f6", positive:true  },
                { label:"ต้นทุนรวม",    value:thb(totalCost)+" ฿",    sub:"",                   color:"#ef4444", positive:false },
                { label:"กำไรขั้นต้น",  value:thb(grossProfit)+" ฿",  sub:`Margin ${((grossProfit/totalRevenue)*100).toFixed(1)}%`, color:"#10b981", positive:true },
                { label:"จำนวนบิล",     value:totalBills+" บิล",      sub:`เฉลี่ย ${thb(totalRevenue/totalBills)} ฿/บิล`, color:"#8b5cf6", positive:true },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500 mb-1">{c.label}</p>
                  <p className="text-[20px] font-bold" style={{ color: c.color }}>{c.value}</p>
                  {c.sub && <p className={clsx("text-[11px] mt-1", c.positive ? "text-emerald-500" : "text-slate-400")}>{c.sub}</p>}
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-slate-700 mb-4">ยอดขาย vs ต้นทุน</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                    <defs>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize:11, fill:"#94a3b8" }} />
                    <YAxis tick={{ fontSize:10, fill:"#94a3b8" }} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v:number,name:string)=>[`${thb(v)} ฿`, name==="revenue"?"ยอดขาย":"ต้นทุน"]}
                      contentStyle={{ fontFamily:"Sarabun, sans-serif", fontSize:12, borderRadius:8 }} />
                    <Legend formatter={v=><span style={{fontSize:12,color:"#64748b"}}>{v==="revenue"?"ยอดขาย":"ต้นทุน"}</span>} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revenue)" name="revenue" />
                    <Area type="monotone" dataKey="cost"    stroke="#ef4444" strokeWidth={2} fill="url(#cost)"    name="cost"    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Category pie */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-slate-700 mb-4">ยอดขายตามหมวดหมู่</h2>
                <div className="flex items-center gap-4">
                  <div className="h-44">
                    <ResponsiveContainer width={180} height="100%">
                      <PieChart>
                        <Pie data={CATEGORY_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                          {CATEGORY_DATA.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v:number)=>[`${v}%`, ""]} contentStyle={{ fontSize:12, borderRadius:8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {CATEGORY_DATA.map(c => (
                      <div key={c.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:c.color }} />
                        <span className="flex-1 text-slate-600">{c.name}</span>
                        <span className="font-medium">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-slate-700 mb-4">สินค้าขายดี</h2>
                <div className="space-y-3">
                  {TOP_PRODUCTS.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i+1}
                      </span>
                      <span className="text-xl">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full bg-blue-400"
                            style={{ width: `${(p.sold / TOP_PRODUCTS[0].sold) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-slate-800">{p.sold} ชิ้น</p>
                        <p className="text-[11px] text-slate-400">{thb(p.revenue)} ฿</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bills by day bar chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-slate-700 mb-4">จำนวนบิลต่อวัน</h2>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_DATA} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize:11, fill:"#94a3b8" }} />
                    <YAxis tick={{ fontSize:10, fill:"#94a3b8" }} />
                    <Tooltip formatter={(v:number)=>[`${v} บิล`,""]} contentStyle={{ fontSize:12, borderRadius:8 }} />
                    <Bar dataKey="bills" fill="#6366f1" radius={[4,4,0,0]} name="bills" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
