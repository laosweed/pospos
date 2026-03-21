"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product, Category } from "@/lib/supabase/types";

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

const EMPTY = { name:"", sku:"", emoji:"🛍️", category_id:"" as string|null, price:0, cost:0, stock:0, active:true, image_url:null as string|null };

export default function SkuPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").eq("store_id", STORE_ID).order("name"),
      supabase.from("categories").select("*").eq("store_id", STORE_ID).order("sort_order"),
    ]);
    if (prods) setProducts(prods);
    if (cats)  setCategories(cats);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    search === "" || p.name.includes(search) || (p.sku ?? "").includes(search)
  );

  const openEdit = (p: Product) => { setEditing(p); setForm({ name:p.name, sku:p.sku??"", emoji:p.emoji, category_id:p.category_id, price:p.price, cost:p.cost, stock:p.stock, active:p.active, image_url:p.image_url }); setIsNew(false); };
  const openNew  = () => { setEditing({} as Product); setForm({...EMPTY, category_id: categories[0]?.id ?? null}); setIsNew(true); };

  const handleSave = async () => {
    setSaving(true);
    if (isNew) {
      await (supabase.from("products") as any).insert({ store_id: STORE_ID, ...form, sku: form.sku || null });
    } else if (editing?.id) {
      await (supabase.from("products") as any).update({ ...form, sku: form.sku || null }).eq("id", editing.id);
    }
    await load();
    setEditing(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getCatName = (id: string|null) => categories.find(c => c.id === id)?.name ?? "-";

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">สินค้า (SKU)</h1>
              <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15}/> เพิ่มสินค้า
              </button>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาชื่อ SKU..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"/>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">SKU</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">หมวดหมู่</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">ราคาขาย</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">ต้นทุน</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">กำไร%</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                      <th className="px-4 py-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const margin = p.price > 0 ? ((p.price-p.cost)/p.price*100) : 0;
                      return (
                        <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="text-xl">{p.emoji}</span><span className="font-medium text-slate-800">{p.name}</span></div></td>
                          <td className="px-4 py-3 font-mono text-[12px] text-blue-600">{p.sku ?? "-"}</td>
                          <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{getCatName(p.category_id)}</span></td>
                          <td className="px-4 py-3 text-right font-medium">{thb(p.price)} ฿</td>
                          <td className="px-4 py-3 text-right text-slate-500">{thb(p.cost)} ฿</td>
                          <td className="px-4 py-3 text-right">
                            <span className={clsx("font-semibold", margin>=40?"text-emerald-500":margin>=20?"text-amber-500":"text-red-500")}>{margin.toFixed(0)}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full", p.active?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500")}>
                              {p.active?"ใช้งาน":"ปิดใช้"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-end">
                              <button onClick={()=>openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={13}/></button>
                              <button onClick={()=>handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                            </div>
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
      {editing!==null && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={()=>setEditing(null)}>
          <div className="bg-white w-[420px] h-full overflow-auto shadow-2xl p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-800">{isNew?"เพิ่มสินค้าใหม่":"แก้ไขสินค้า"}</h2>
              <button onClick={()=>setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="text-center text-5xl mb-2">{form.emoji}</div>
              {[["ชื่อสินค้า","name","text"],["SKU","sku","text"],["Emoji","emoji","text"]].map(([l,k,t])=>(
                <div key={k}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                  <input type={t} value={(form as Record<string,unknown>)[k] as string}
                    onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">หมวดหมู่</label>
                <select value={form.category_id ?? ""} onChange={e=>setForm(f=>({...f,category_id:e.target.value||null}))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">-- ไม่ระบุ --</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["ราคาขาย","price"],["ต้นทุน","cost"],["สต็อก","stock"]].map(([l,k])=>(
                  <div key={k}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                    <input type="number" value={(form as Record<string,unknown>)[k] as number}
                      onChange={e=>setForm(f=>({...f,[k]:parseFloat(e.target.value)||0}))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">สถานะการขาย</span>
                <button onClick={()=>setForm(f=>({...f,active:!f.active}))}
                  className={clsx("w-11 h-6 rounded-full relative transition-colors",form.active?"bg-blue-500":"bg-slate-300")}>
                  <div className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all",form.active?"left-5":"left-0.5")}/>
                </button>
              </div>
              <button onClick={handleSave} disabled={saving||!form.name}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                {saving?"กำลังบันทึก...":"บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
