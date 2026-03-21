"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { GripVertical, Save, RefreshCw } from "lucide-react";
import { supabase, STORE_ID } from "@/lib/supabase/browser";

type Item = { id: string; name: string; emoji: string; sort_order: number; category: string };

export default function SortPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, emoji, sort_order:id, categories(name)")
        .eq("store_id", STORE_ID)
        .eq("active", true);
      if (data) {
        setItems((data as { id: string; name: string; emoji: string; categories: { name: string } | null }[]).map((p, i) => ({
          id: p.id, name: p.name, emoji: p.emoji, sort_order: i, category: p.categories?.name ?? "ไม่มีหมวด"
        })));
      }
      setLoading(false);
    })();
  }, []);

  const onDragStart = (i: number) => setDragging(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    setItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragging, 1);
      next.splice(i, 0, moved);
      return next.map((x, idx) => ({ ...x, sort_order: idx }));
    });
    setDragging(i);
  };

  const saveOrder = async () => {
    setSaving(true);
    await Promise.all(items.map((item, i) =>
      (supabase.from("products") as any).update({ sku: item.id }).eq("id", item.id)
    ));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cats = [...new Set(items.map(i => i.category))];

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">จัดเรียงสินค้า</h1>
              <button onClick={saveOrder} disabled={saving || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {saved ? "บันทึกแล้ว ✓" : "บันทึกลำดับ"}
              </button>
            </div>
            <p className="text-sm text-slate-500">ลากเพื่อจัดเรียงลำดับการแสดงสินค้าในหน้าขาย</p>

            {loading ? (
              <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
            ) : (
              <div className="space-y-4">
                {cats.map(cat => (
                  <div key={cat} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-700 text-sm">{cat}</h3>
                    </div>
                    <div>
                      {items.filter(i => i.category === cat).map((item, idx) => {
                        const globalIdx = items.findIndex(x => x.id === item.id);
                        return (
                          <div key={item.id} draggable
                            onDragStart={() => onDragStart(globalIdx)}
                            onDragOver={e => onDragOver(e, globalIdx)}
                            onDragEnd={() => setDragging(null)}
                            className={`flex items-center gap-3 px-4 py-3 border-b border-slate-50 cursor-grab active:cursor-grabbing transition-colors ${dragging === globalIdx ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                            <GripVertical size={16} className="text-slate-300 flex-shrink-0" />
                            <span className="text-xl">{item.emoji}</span>
                            <span className="font-medium text-slate-700 flex-1">{item.name}</span>
                            <span className="text-[12px] text-slate-400">#{idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
