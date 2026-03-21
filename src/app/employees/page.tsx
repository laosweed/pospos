"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Employee } from "@/lib/supabase/types";

const ROLES: Record<string, { label: string; color: string; bg: string }> = {
  owner:   { label:"เจ้าของ",   color:"#7c3aed", bg:"#f5f3ff" },
  manager: { label:"ผู้จัดการ", color:"#1d4ed8", bg:"#eff6ff" },
  cashier: { label:"แคชเชียร์", color:"#047857", bg:"#f0fdf4" },
  staff:   { label:"พนักงาน",   color:"#374151", bg:"#f9fafb" },
};

const EMPTY_FORM = { name:"", email:"", phone:"", role:"cashier", active:true };

export default function EmployeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .eq("store_id", STORE_ID)
      .order("name");
    if (data) setEmployees(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setSelected({} as Employee);
    setIsNew(true);
  };

  const openEdit = (emp: Employee) => {
    setForm({ name: emp.name, email: emp.email ?? "", phone: emp.phone ?? "", role: emp.role, active: emp.active });
    setSelected(emp);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      role: form.role,
      active: form.active,
    };
    if (isNew) {
      await (supabase.from("employees") as any).insert({ store_id: STORE_ID, ...payload });
    } else if (selected?.id) {
      await (supabase.from("employees") as any).update(payload).eq("id", selected.id);
    }
    await load();
    setSelected(null);
    setSaving(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">พนักงาน</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> เพิ่มพนักงาน
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">พนักงานทั้งหมด</p>
                <p className="text-[22px] font-bold text-blue-600">{employees.length} คน</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ใช้งานอยู่</p>
                <p className="text-[22px] font-bold text-emerald-600">{employees.filter(e=>e.active).length} คน</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ปิดใช้งาน</p>
                <p className="text-[22px] font-bold text-slate-400">{employees.filter(e=>!e.active).length} คน</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {employees.map(emp => {
                  const roleInfo = ROLES[emp.role] ?? ROLES.staff;
                  const joined = new Date(emp.created_at).toLocaleDateString("th-TH");
                  return (
                    <div key={emp.id} className={clsx("bg-white rounded-2xl p-5 shadow-sm", !emp.active && "opacity-60")}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {emp.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{emp.name}</p>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color: roleInfo.color, background: roleInfo.bg }}>
                              {roleInfo.label}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => openEdit(emp)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-sm text-slate-500 mb-4">
                        {emp.email && <p>{emp.email}</p>}
                        {emp.phone && <p>{emp.phone}</p>}
                        <p className="text-[11px]">เข้าร่วม {joined}</p>
                      </div>

                      <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                        emp.active ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                      )}>
                        {emp.active ? "ใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit drawer */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[380px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-800">{isNew ? "เพิ่มพนักงานใหม่" : "แก้ไขพนักงาน"}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {([["ชื่อ-นามสกุล","name"],["อีเมล","email"],["เบอร์โทร","phone"]] as const).map(([l, k]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                  <input
                    value={form[k] as string}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">ตำแหน่ง</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {Object.entries(ROLES).map(([v, r]) => <option key={v} value={v}>{r.label}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">สถานะการใช้งาน</span>
                <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={clsx("w-11 h-6 rounded-full relative transition-colors", form.active ? "bg-blue-500" : "bg-slate-300")}>
                  <div className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", form.active ? "left-5" : "left-0.5")} />
                </button>
              </div>
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
