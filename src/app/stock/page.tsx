"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Edit2, Package, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product } from "@/lib/supabase/types";

type ProductWithCat = Product & { categories: { name: string } | null };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function StockPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<ProductWithCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [filter, setFilter] = useState<"all"|"low"|"out">("all");
  const [editId, setEditId] = useState<string|null>(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving] = useState(false);

  const MIN_STOCK = 5; // threshold for "low" since DB doesn't have minStock

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", STORE_ID)
        .order("name");
      if (data) setProducts(data as ProductWithCat[]);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ["ทั้งหมด", ...new Set(products.map(p => p.categories?.name ?? "อื่นๆ").filter(Boolean))];

  const filtered = products.filter(p =>
    (categoryFilter === "ทั้งหมด" || p.categories?.name === categoryFilter) &&
    (search === "" || p.name.includes(search) || (p.sku ?? "").includes(search)) &&
    (filter === "all" ||
     (filter === "low" && p.stock > 0 && p.stock <= MIN_STOCK) ||
     (filter === "out" && p.stock === 0))
  );

  const totalValue = products.reduce((s, p) => s + p.cost * p.stock, 0);
  const lowCount  = products.filter(p => p.stock > 0 && p.stock <= MIN_STOCK).length;
  const outCount  = products.filter(p => p.stock === 0).length;

  const saveStock = async (id: string) => {
    const val = parseInt(editStock);
    if (isNaN(val) || val < 0) { setEditId(null); return; }
    setSaving(true);
    await (supabase.from("products") as any).update({ stock: val }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: val } : p));
    setEditId(null);
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
              <h1 className="text-xl font-bold text-slate-800">สต็อกสินค้า</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> เพิ่มสินค้า
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label:"สินค้าทั้งหมด", value:`${products.length} รายการ`, color:"#3b82f6" },
                { label:"มูลค่าสินค้า",  value:`${thb(totalValue)} ฿`,      color:"#10b981" },
                { label:"ใกล้หมด",      value:`${lowCount} รายการ`,         color:"#f59e0b" },
                { label:"หมดสต็อก",     value:`${outCount} รายการ`,         color:"#ef4444" },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-[12px] text-slate-500 mb-1">{c.label}</p>
                  <p className="text-[18px] font-bold" style={{ color: c.color }}>{c.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินค้า หรือ SKU..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-1">
                {([["all","ทั้งหมด"],["low","ใกล้หมด"],["out","หมดสต็อก"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setFilter(v)}
                    className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      filter===v?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                    {l}
                  </button>
                ))}
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
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">คงเหลือ</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                      <th className="px-4 py-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const isLow = p.stock > 0 && p.stock <= MIN_STOCK;
                      const isOut = p.stock === 0;
                      return (
                        <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="text-xl">{p.emoji}</span><span className="font-medium text-slate-800">{p.name}</span></div></td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">{p.sku ?? "-"}</td>
                          <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{p.categories?.name ?? "-"}</span></td>
                          <td className="px-4 py-3 text-right font-medium">{thb(p.price)} ฿</td>
                          <td className="px-4 py-3 text-right text-slate-500">{thb(p.cost)} ฿</td>
                          <td className="px-4 py-3 text-right">
                            {editId===p.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <input type="number" value={editStock} onChange={e=>setEditStock(e.target.value)}
                                  onKeyDown={e=>{if(e.key==="Enter")saveStock(p.id);if(e.key==="Escape")setEditId(null);}}
                                  autoFocus className="w-20 border border-blue-400 rounded-lg px-2 py-1 text-right text-sm focus:outline-none"/>
                                <button onClick={()=>saveStock(p.id)} disabled={saving} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">บันทึก</button>
                              </div>
                            ) : (
                              <span className={clsx("font-bold", isOut?"text-red-500":isLow?"text-amber-500":"text-slate-800")}>
                                {isLow&&<AlertTriangle size={12} className="inline mr-1 text-amber-400"/>}
                                {p.stock}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx("text-[11px] font-medium px-2.5 py-1 rounded-full",
                              isOut?"bg-red-100 text-red-600":isLow?"bg-amber-100 text-amber-600":p.active?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-500")}>
                              {isOut?"หมดสต็อก":isLow?"ใกล้หมด":p.active?"ปกติ":"ปิดใช้"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={()=>{setEditId(p.id);setEditStock(String(p.stock));}}
                              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={13}/>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {!loading&&filtered.length===0&&(
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2"><Package size={40} strokeWidth={1}/><p>ไม่พบสินค้า</p></div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
