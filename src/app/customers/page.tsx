"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Edit2, Phone, Mail, Award, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Customer } from "@/lib/supabase/types";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

function tierLabel(points: number) {
  if (points >= 1000) return { label:"ทอง",    color:"#f59e0b", bg:"#fffbeb" };
  if (points >= 400)  return { label:"เงิน",    color:"#64748b", bg:"#f8fafc" };
  return                     { label:"ทองแดง", color:"#b45309", bg:"#fef3c7" };
}

const EMPTY_FORM = { name:"", phone:"", email:"" };

export default function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("store_id", STORE_ID)
      .order("name");
    if (data) setCustomers(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    search === "" ||
    c.name.includes(search) ||
    (c.phone ?? "").includes(search) ||
    (c.email ?? "").includes(search)
  );

  const openNew = () => {
    setForm(EMPTY_FORM);
    setSelected({} as Customer);
    setIsNew(true);
  };

  const openEdit = (c: Customer) => {
    setForm({ name: c.name, phone: c.phone ?? "", email: c.email ?? "" });
    setSelected(c);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
    };
    if (isNew) {
      await supabase.from("customers").insert({ store_id: STORE_ID, points: 0, ...payload });
    } else if (selected?.id) {
      await supabase.from("customers").update(payload).eq("id", selected.id);
    }
    await load();
    setSelected(null);
    setSaving(false);
  };

  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ลูกค้า</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> เพิ่มลูกค้า
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ลูกค้าทั้งหมด</p>
                <p className="text-[22px] font-bold text-blue-600">{customers.length} ราย</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">แต้มสะสมรวม</p>
                <p className="text-[22px] font-bold text-amber-500">{thb(totalPoints)} แต้ม</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อ เบอร์โทร อีเมล..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">ชื่อ-นามสกุล</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">ติดต่อ</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">ระดับ</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">แต้มสะสม</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">สมาชิกตั้งแต่</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => {
                      const tier = tierLabel(c.points);
                      const joined = new Date(c.created_at).toLocaleDateString("th-TH");
                      return (
                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center flex-shrink-0">
                                {c.name[0]}
                              </div>
                              <span className="font-medium text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              {c.phone && <p className="text-slate-600 flex items-center gap-1"><Phone size={11} />{c.phone}</p>}
                              {c.email && <p className="text-slate-400 text-[12px] flex items-center gap-1"><Mail size={11} />{c.email}</p>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: tier.color, background: tier.bg }}>
                              {tier.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="flex items-center justify-end gap-1 font-bold text-amber-500">
                              <Award size={12} />{thb(c.points)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[12px]">{joined}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit drawer */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[380px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-800">{isNew ? "เพิ่มลูกค้าใหม่" : "ข้อมูลลูกค้า"}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {([["ชื่อ-นามสกุล","name"],["เบอร์โทร","phone"],["อีเมล","email"]] as const).map(([l, k]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                  <input
                    value={form[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
              {!isNew && selected?.id && (
                <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">แต้มสะสม</p>
                    <p className="text-2xl font-bold text-amber-500">{thb(selected.points)} <span className="text-sm">แต้ม</span></p>
                  </div>
                  <Award size={32} className="text-amber-400" />
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
