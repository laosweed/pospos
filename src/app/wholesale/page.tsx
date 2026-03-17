"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Save, RefreshCw } from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";

type Row = { id: string; name: string; emoji: string; retailPrice: number; minQty: number; wholesalePrice: number };
function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function WholesalePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("products").select("id, name, emoji, price").eq("store_id", STORE_ID).eq("active", true)
      .then(({ data }) => {
        if (data) setRows((data as { id: string; name: string; emoji: string; price: number }[]).map(p => ({
          id: p.id, name: p.name, emoji: p.emoji, retailPrice: p.price,
          minQty: 10, wholesalePrice: Math.round(p.price * 0.8)
        })));
        setLoading(false);
      });
  }, []);

  const upd = (id: string, f: "minQty" | "wholesalePrice", v: number) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">ราคาขายส่ง</h1>
                <p className="text-sm text-slate-500 mt-0.5">กำหนดราคาพิเศษสำหรับลูกค้าที่สั่งซื้อจำนวนมาก</p>
              </div>
              <button onClick={save} disabled={saving || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {saved ? "บันทึกแล้ว ✓" : "บันทึก"}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                      <th className="text-right px-4 py-3 text-slate-500 font-medium">ราคาปลีก</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">ขั้นต่ำ (ชิ้น)</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">ราคาส่ง (฿)</th>
                      <th className="text-center px-4 py-3 text-slate-500 font-medium">ส่วนลด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span className="text-lg">{r.emoji}</span>
                          <span className="font-medium text-slate-700">{r.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500">{thb(r.retailPrice)} ฿</td>
                        <td className="px-4 py-3 text-center">
                          <input type="number" min="1" value={r.minQty} onChange={e => upd(r.id, "minQty", parseInt(e.target.value) || 1)}
                            className="w-20 text-center border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-400" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="number" min="0" value={r.wholesalePrice} onChange={e => upd(r.id, "wholesalePrice", parseFloat(e.target.value) || 0)}
                            className="w-24 text-center border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-400" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            -{Math.max(0, ((1 - r.wholesalePrice / r.retailPrice) * 100)).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
