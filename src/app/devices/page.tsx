"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Monitor, Printer, Wifi, WifiOff, Plus, Settings, X } from "lucide-react";
import clsx from "clsx";

type Device = { id: number; name: string; type: "pos" | "printer" | "scanner"; ip: string; online: boolean; branch: string };

const INIT: Device[] = [
  { id: 1, name: "POS #1 (สาขาหลัก)", type: "pos", ip: "192.168.1.101", online: true, branch: "สาขาหลัก" },
  { id: 2, name: "เครื่องพิมพ์ใบเสร็จ", type: "printer", ip: "192.168.1.102", online: true, branch: "สาขาหลัก" },
  { id: 3, name: "เครื่องสแกนบาร์โค้ด", type: "scanner", ip: "-", online: false, branch: "สาขาหลัก" },
];
let nextId = 10;
const TYPES = { pos: { label: "POS", icon: Monitor, color: "text-blue-500", bg: "bg-blue-50" }, printer: { label: "เครื่องพิมพ์", icon: Printer, color: "text-emerald-500", bg: "bg-emerald-50" }, scanner: { label: "สแกนเนอร์", icon: Settings, color: "text-violet-500", bg: "bg-violet-50" } };

export default function DevicesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [devices, setDevices] = useState<Device[]>(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "pos" as Device["type"], ip: "", branch: "สาขาหลัก" });

  const save = () => {
    setDevices(p => [...p, { id: nextId++, ...form, online: false }]);
    setModal(false);
  };
  const toggle = (id: number) => setDevices(p => p.map(d => d.id === id ? { ...d, online: !d.online } : d));

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">อุปกรณ์</h1>
              <button onClick={() => { setForm({ name: "", type: "pos", ip: "", branch: "สาขาหลัก" }); setModal(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มอุปกรณ์
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">อุปกรณ์ทั้งหมด</p>
                <p className="text-xl font-bold text-blue-600">{devices.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ออนไลน์</p>
                <p className="text-xl font-bold text-emerald-600">{devices.filter(d => d.online).length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500">ออฟไลน์</p>
                <p className="text-xl font-bold text-slate-400">{devices.filter(d => !d.online).length}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">อุปกรณ์</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ประเภท</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">IP Address</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">สาขา</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {devices.map(d => {
                    const T = TYPES[d.type];
                    return (
                      <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-700">
                          <div className="flex items-center gap-3">
                            <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", T.bg)}>
                              <T.icon size={14} className={T.color} />
                            </div>
                            {d.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{T.label}</td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-[12px]">{d.ip}</td>
                        <td className="px-4 py-3 text-slate-600">{d.branch}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx("flex items-center justify-center gap-1.5 text-[12px] font-medium",
                            d.online ? "text-emerald-600" : "text-slate-400")}>
                            {d.online ? <Wifi size={12} /> : <WifiOff size={12} />}
                            {d.online ? "ออนไลน์" : "ออฟไลน์"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggle(d.id)}
                            className="text-[11px] px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                            {d.online ? "ตัดการเชื่อมต่อ" : "เชื่อมต่อ"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">เพิ่มอุปกรณ์</h2>
              <button onClick={() => setModal(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="ชื่ออุปกรณ์"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Device["type"] }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                <option value="pos">POS</option>
                <option value="printer">เครื่องพิมพ์</option>
                <option value="scanner">สแกนเนอร์</option>
              </select>
              <input value={form.ip} onChange={e => setForm(p => ({ ...p, ip: e.target.value }))} placeholder="IP Address"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">เพิ่ม</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
