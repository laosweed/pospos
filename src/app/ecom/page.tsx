"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Globe, ShoppingBag, Link, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";

type Channel = { id: string; name: string; logo: string; connected: boolean; orders: number; revenue: number };

const CHANNELS: Channel[] = [
  { id: "shopee", name: "Shopee", logo: "🛍️", connected: false, orders: 0, revenue: 0 },
  { id: "lazada", name: "Lazada", logo: "🔶", connected: false, orders: 0, revenue: 0 },
  { id: "grab", name: "GrabFood", logo: "🟩", connected: true, orders: 45, revenue: 12500 },
  { id: "foodpanda", name: "foodpanda", logo: "🐼", connected: false, orders: 0, revenue: 0 },
  { id: "lineman", name: "LINE MAN", logo: "🟢", connected: false, orders: 0, revenue: 0 },
  { id: "website", name: "เว็บไซต์ร้าน", logo: "🌐", connected: false, orders: 0, revenue: 0 },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function EcomPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);

  const toggle = (id: string) => setChannels(p => p.map(c => c.id === id ? { ...c, connected: !c.connected } : c));
  const connected = channels.filter(c => c.connected);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <h1 className="text-xl font-bold text-slate-800">อีคอมเมิร์ซ</h1>

            {connected.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500">ช่องทางที่เชื่อมต่อ</p>
                  <p className="text-xl font-bold text-blue-600">{connected.length} ช่องทาง</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500">ออเดอร์รวม</p>
                  <p className="text-xl font-bold text-emerald-600">{connected.reduce((s,c) => s + c.orders, 0)} รายการ</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500">ยอดขายออนไลน์</p>
                  <p className="text-xl font-bold text-violet-600">{thb(connected.reduce((s,c) => s + c.revenue, 0))} ฿</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {channels.map(c => (
                <div key={c.id} className={clsx("bg-white rounded-xl p-5 shadow-sm border transition-all", c.connected ? "border-emerald-200" : "border-transparent")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">{c.logo}</div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{c.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {c.connected
                            ? <><CheckCircle size={11} className="text-emerald-500" /><span className="text-[11px] text-emerald-600">เชื่อมต่อแล้ว</span></>
                            : <><AlertCircle size={11} className="text-slate-400" /><span className="text-[11px] text-slate-400">ยังไม่ได้เชื่อมต่อ</span></>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {c.connected && (
                    <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-slate-700">{c.orders}</p>
                        <p className="text-[10px] text-slate-400">ออเดอร์</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-slate-700">{thb(c.revenue)}</p>
                        <p className="text-[10px] text-slate-400">ยอดขาย ฿</p>
                      </div>
                    </div>
                  )}
                  <button onClick={() => toggle(c.id)}
                    className={clsx("w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                      c.connected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-600 text-white hover:bg-blue-700")}>
                    <Link size={14} />{c.connected ? "ยกเลิกการเชื่อมต่อ" : "เชื่อมต่อ"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
