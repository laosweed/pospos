"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, MapPin, Phone, Edit2, GitBranch, X } from "lucide-react";

type Branch = { id: number; name: string; address: string; phone: string; manager: string; active: boolean };
const INIT: Branch[] = [
  { id: 1, name: "สาขาหลัก (สยาม)", address: "123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ", phone: "02-111-2222", manager: "ชนิ่น เกษมทรัพย์", active: true },
];
let nextId = 10;
const EMPTY = { name: "", address: "", phone: "", manager: "", active: true };

export default function BranchesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [branches, setBranches] = useState<Branch[]>(INIT);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState(EMPTY);

  const open = (b?: Branch) => { setEditing(b ?? null); setForm(b ? { ...b } : EMPTY); setModal(true); };
  const save = () => {
    const d: Branch = { id: editing?.id ?? nextId++, ...form };
    setBranches(p => editing ? p.map(b => b.id === editing.id ? d : b) : [...p, d]);
    setModal(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">สาขา</h1>
              <button onClick={() => open()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มสาขา
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {branches.map((b, i) => (
                <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <GitBranch size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800">{b.name}</h3>
                          {i === 0 && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">หลัก</span>}
                          {!b.active && <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">ปิด</span>}
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5">ผู้จัดการ: {b.manager}</p>
                      </div>
                    </div>
                    <button onClick={() => open(b)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500"><MapPin size={13} className="text-slate-400 flex-shrink-0" />{b.address}</div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-500"><Phone size={13} className="text-slate-400" />{b.phone}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => open()} className="bg-white/60 rounded-xl p-5 shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-colors min-h-32">
                <Plus size={24} /><span className="text-sm font-medium">เพิ่มสาขาใหม่</span>
              </button>
            </div>
          </div>
        </main>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? "แก้ไขสาขา" : "เพิ่มสาขา"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[["name","ชื่อสาขา"],["manager","ผู้จัดการ"],["phone","เบอร์โทร"],["address","ที่อยู่"]].map(([k,l]) => (
                <div key={k}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{l}</label>
                  <input value={(form as unknown as Record<string,string>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="accent-blue-600" />
                เปิดใช้งาน
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
