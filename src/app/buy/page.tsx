"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Trash2, Plus, Minus, Package } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product, Purchase, PurchaseItem } from "@/lib/supabase/types";
import { useToast } from "@/components/Toast";

type RecentPurchase = Purchase & { item_count: number };

interface CartItem { product: Product; qty: number; unitCost: number }

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function BuyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [recent, setRecent] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [supplier, setSupplier] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = async () => {
    const [{ data: prods }, { data: purch }] = await Promise.all([
      supabase.from("products").select("*").eq("store_id", STORE_ID).eq("active", true).order("name"),
      supabase.from("purchases").select("*, purchase_items(id)").eq("store_id", STORE_ID).order("purchased_at", { ascending: false }).limit(10),
    ]);
    if (prods) setProducts(prods);
    if (purch) {
      setRecent(purch.map(p => ({
        ...p,
        purchase_items: undefined,
        item_count: (p.purchase_items as unknown as { id: string }[])?.length ?? 0,
      })) as RecentPurchase[]);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    search === "" || p.name.includes(search) || (p.sku ?? "").includes(search)
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? {...i, qty: i.qty+1} : i);
      return [...prev, { product, qty:1, unitCost: product.cost }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i=>i.product.id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0));
  };

  const updateCost = (id: string, val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n)) setCart(prev => prev.map(i=>i.product.id===id?{...i,unitCost:n}:i));
  };

  const total = cart.reduce((s,i)=>s+i.unitCost*i.qty, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const { data: purchaseData, error: purchErr } = await supabase
        .from("purchases")
        .insert({
          store_id: STORE_ID,
          supplier: supplier || null,
          total,
          status: "completed",
          purchased_at: now,
        })
        .select("id")
        .single();

      if (purchErr || !purchaseData) throw purchErr;

      const items: Omit<PurchaseItem, "id">[] = cart.map(i => ({
        purchase_id: purchaseData.id,
        product_id: i.product.id,
        name: i.product.name,
        cost: i.unitCost,
        quantity: i.qty,
        subtotal: i.unitCost * i.qty,
      }));
      await supabase.from("purchase_items").insert(items);

      // Update stock for each product
      for (const item of cart) {
        await supabase
          .from("products")
          .update({ stock: item.product.stock + item.qty })
          .eq("id", item.product.id);
      }

      toast.success("บันทึกรายการรับซื้อสำเร็จ");
      setCart([]);
      setSupplier("");
      await load();
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 flex h-[calc(100vh-50px)] overflow-hidden" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>

          {/* Left: product list */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white px-4 py-3 shadow-sm flex-shrink-0">
              <h1 className="text-lg font-bold text-slate-800 mb-3">นำเข้า / รับซื้อสินค้า</h1>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาสินค้า SKU..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"/></div>
              ) : (
                <>
                  <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
                    {filtered.map(p => {
                      const inCart = cart.find(i=>i.product.id===p.id);
                      return (
                        <button key={p.id} onClick={() => addToCart(p)}
                          className={clsx("bg-white rounded-xl p-3 text-left shadow-sm hover:shadow-md border-2 transition-all",
                            inCart ? "border-purple-400" : "border-transparent"
                          )}>
                          <div className="text-3xl mb-2 text-center">{p.emoji}</div>
                          <p className="text-[12px] font-medium text-slate-800 leading-tight mb-1">{p.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{p.sku ?? "-"}</p>
                          <p className="text-[14px] font-bold text-purple-600 mt-1">{thb(p.cost)} ฿</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">สต็อก: {p.stock}</p>
                          {inCart && (
                            <span className="mt-1 inline-block bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">×{inCart.qty}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Recent orders */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <h2 className="font-semibold text-slate-700">รายการรับซื้อล่าสุด</h2>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left px-4 py-2.5 text-slate-500 font-medium">วันที่</th>
                          <th className="text-left px-4 py-2.5 text-slate-500 font-medium">ผู้ขาย</th>
                          <th className="text-right px-4 py-2.5 text-slate-500 font-medium">รายการ</th>
                          <th className="text-right px-4 py-2.5 text-slate-500 font-medium">ยอดรวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.length === 0 ? (
                          <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">ยังไม่มีรายการ</td></tr>
                        ) : recent.map(r => (
                          <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50">
                            <td className="px-4 py-2.5 text-slate-500">{new Date(r.purchased_at).toLocaleDateString("th-TH")}</td>
                            <td className="px-4 py-2.5 text-slate-700">{r.supplier ?? "-"}</td>
                            <td className="px-4 py-2.5 text-right text-slate-500">{r.item_count} รายการ</td>
                            <td className="px-4 py-2.5 text-right font-medium">{thb(r.total)} ฿</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: order cart */}
          <div className="w-[320px] flex-shrink-0 flex flex-col bg-white shadow-lg">
            <div className="px-4 py-3 border-b flex-shrink-0">
              <h2 className="font-bold text-slate-800">รายการสั่งซื้อ</h2>
            </div>

            <div className="px-4 py-3 border-b flex-shrink-0">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">ผู้ขาย/ซัพพลายเออร์</label>
              <input
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                placeholder="ชื่อร้านค้า/บริษัท..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex-1 overflow-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300 gap-2">
                  <Package size={36} strokeWidth={1} />
                  <p className="text-sm">เลือกสินค้าที่ต้องการสั่ง</p>
                </div>
              ) : cart.map(item => (
                <div key={item.product.id} className="bg-slate-50 rounded-xl p-2.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.product.emoji}</span>
                    <span className="flex-1 text-[13px] font-medium text-slate-800 min-w-0 truncate">{item.product.name}</span>
                    <button onClick={() => updateQty(item.product.id, -99)} className="text-slate-300 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.product.id,-1)} className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300">
                        <Minus size={10} />
                      </button>
                      <span className="text-[13px] font-bold w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id,1)} className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200">
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-slate-400 text-xs">×</span>
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={e => updateCost(item.product.id, e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-2 py-1 text-xs text-right focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-xs text-slate-400">฿</span>
                  </div>
                  <div className="text-right text-[12px] font-semibold text-purple-600">{thb(item.qty * item.unitCost)} ฿</div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 flex-shrink-0">
              <div className="flex justify-between font-bold text-[18px] mb-4">
                <span>ยอดรวม</span>
                <span className="text-purple-600">{thb(total)} ฿</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || saving}
                className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold text-[15px] hover:bg-purple-700 disabled:opacity-40 transition-colors"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกรายการรับซื้อ"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
