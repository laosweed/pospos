"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Phone, Mail, Truck, X, Search } from "lucide-react";

type Vendor = { id: number; name: string; contact: string; phone: string; email: string; category: string; note: string };

const INIT: Vendor[] = [
  { id: 1, name: "บริษัท สยามแป้ง จำกัด", contact: "คุณสมชาย", phone: "02-123-4567", email: "siamflour@email.com", category: "วัตถุดิบ", note: "" },
  { id: 2, name: "ร้านนมโค", contact: "คุณมาลี", phone: "081-234-5678", email: "milkshop@email.com", category: "นม/ครีม", note: "" },
  { id: 3, name: "Thai Sugar Co.", contact: "Mr. John", phone: "02-987-6543", email: "thaisugar@email.com", category: "วัตถุดิบ", note: "ส่งทุกวันจันทร์" },
];
let nextId = 10;

const EMPTY = { name: "", contact: "", phone: "", email: "", category: "วัตถุดิบ", note: "" };

export default function VendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>(INIT);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (v: Vendor) => { setEditing(v); setForm({ name: v.name, contact: v.contact, phone: v.phone, email: v.email, category: v.category, note: v.note }); setModal(true); };
  const save = () => {
    const data: Vendor = { id: editing?.id ?? nextId++, ...form };
    setVendors(prev => editing ? prev.map(v => v.id === editing.id ? data : v) : [...prev, data]);
    setModal(false);
  };

  const filtered = vendors.filter(v => search === "" || v.name.toLowerCase().includes(search.toLowerCase()) || v.contact.includes(search));

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ซัพพลายเออร์</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มซัพพลายเออร์
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาซัพพลายเออร์..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filtered.map(v => (
                <div key={v.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Truck size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{v.name}</h3>
                        <p className="text-[12px] text-slate-500">{v.contact}</p>
                      </div>
                    </div>
                    <button onClick={() => openEdit(v)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <Phone size={12} className="text-slate-400" /> {v.phone}
                    </div>
                    {v.email && <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <Mail size={12} className="text-slate-400" /> {v.email}
                    </div>}
                    <span className="bg-blue-50 text-blue-600 text-[11px] px-2 py-0.5 rounded-full font-medium">{v.category}</span>
                  </div>
                  {v.note && <p className="mt-3 text-[12px] text-slate-400 border-t pt-3">{v.note}</p>}
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2 bg-white rounded-xl">
                <Truck size={48} strokeWidth={1} /><p>ยังไม่มีซัพพลายเออร์</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editing ? "แก้ไขซัพพลายเออร์" : "เพิ่มซัพพลายเออร์"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[["name","ชื่อบริษัท/ร้าน"],["contact","ชื่อผู้ติดต่อ"],["phone","เบอร์โทร"],["email","อีเมล"]].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{label}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">หมวดหมู่</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  {["วัตถุดิบ","นม/ครีม","บรรจุภัณฑ์","อุปกรณ์","อื่นๆ"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">หมายเหตุ</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">ยกเลิก</button>
              <button onClick={save} disabled={!form.name} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
