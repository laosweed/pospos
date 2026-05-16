"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  Search, Trash2, Plus, Minus, X, CreditCard, Banknote, QrCode,
  SlidersHorizontal, ShoppingCart, Bell, LayoutGrid, ChevronDown,
  Users, Archive, PauseCircle, DollarSign, MoreVertical, Percent,
} from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product } from "@/lib/supabase/types";
import { useTranslation } from "@/context/LanguageContext";

interface CartItem { product: Product; qty: number }
type ProductWithCat = Product & { categories: { name: string } | null };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* ── Product placeholder images (bakery themed) ── */
const PRODUCT_IMAGES: Record<string, string> = {};
function getProductImage(product: Product): string {
  if (product.image_url) return product.image_url;
  if (PRODUCT_IMAGES[product.id]) return PRODUCT_IMAGES[product.id];
  // Generate a stable placeholder based on product id hash
  const hash = product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const imgId = 400 + (hash % 100);
  const url = `https://picsum.photos/seed/${imgId}/400/300`;
  PRODUCT_IMAGES[product.id] = url;
  return url;
}

/* ═══════════════════════════════════════════════════════════════
   Payment Modal (same as before, unchanged)
   ═══════════════════════════════════════════════════════════════ */
function PaymentModal({ total, onClose, onConfirm }: {
  total: number; onClose: () => void; onConfirm: (method: string) => void;
}) {
  const [method, setMethod] = useState<"cash"|"card"|"qr">("cash");
  const [received, setReceived] = useState("");
  const receivedNum = parseFloat(received) || 0;
  const change = method === "cash" ? Math.max(0, receivedNum - total) : 0;
  const quickAmounts = [total, Math.ceil(total/100)*100, Math.ceil(total/500)*500, Math.ceil(total/1000)*1000]
    .filter((v,i,a) => a.indexOf(v) === i).slice(0,4);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">ชำระเงิน</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">ยอดชำระ</p>
            <p className="text-4xl font-bold text-blue-600">{thb(total)} ฿</p>
          </div>
          <div className="flex gap-2">
            {([["cash","เงินสด",Banknote],["card","บัตรเครดิต",CreditCard],["qr","QR Code",QrCode]] as const).map(([id,label,Icon]) => (
              <button key={id} onClick={() => setMethod(id)}
                className={clsx("flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  method===id?"border-blue-500 bg-blue-50 text-blue-600":"border-slate-200 text-slate-500 hover:border-slate-300")}>
                <Icon size={18}/>{label}
              </button>
            ))}
          </div>
          {method==="cash" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">รับเงินมา</label>
              <input type="number" value={received} onChange={e=>setReceived(e.target.value)} placeholder="0.00"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xl font-bold text-right focus:outline-none focus:border-blue-400"/>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(amt=>(
                  <button key={amt} onClick={()=>setReceived(String(amt))}
                    className="py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200">{thb(amt)}</button>
                ))}
              </div>
              {receivedNum>0&&(
                <div className="flex justify-between items-center bg-emerald-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-slate-600">เงินทอน</span>
                  <span className="text-xl font-bold text-emerald-600">{thb(change)} ฿</span>
                </div>
              )}
            </div>
          )}
          {method==="qr"&&<div className="flex flex-col items-center gap-3 py-4"><div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">QR Code</div><p className="text-sm text-slate-500">สแกนเพื่อชำระเงิน PromptPay</p></div>}
          {method==="card"&&<div className="flex flex-col items-center gap-3 py-4"><CreditCard size={48} className="text-slate-300"/><p className="text-sm text-slate-500">เสียบ/แตะบัตร ที่เครื่องรับบัตร</p></div>}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">ยกเลิก</button>
          <button onClick={()=>onConfirm(method)} disabled={method==="cash"&&receivedNum<total}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors">ยืนยันชำระเงิน</button>
        </div>
      </div>
    </div>
  );
}

function ReceiptModal({ cart, total, method, receiptNo, onClose }: {
  cart: CartItem[]; total: number; method: string; receiptNo: string; onClose: () => void;
}) {
  const methodLabel = method==="cash"?"เงินสด":method==="card"?"บัตรเครดิต":"QR Code";
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[360px]">
        <div className="p-6 text-center border-b">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-2xl">✓</span></div>
          <h2 className="text-lg font-bold text-slate-800">ชำระเงินสำเร็จ</h2>
          <p className="text-sm text-slate-400 mt-1">#{receiptNo}</p>
        </div>
        <div className="p-6 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500"><span>วันที่</span><span>{dateStr}</span></div>
          <div className="flex justify-between text-slate-500"><span>ชำระด้วย</span><span>{methodLabel}</span></div>
          <div className="border-t my-3"/>
          {cart.map(item=>(
            <div key={item.product.id} className="flex justify-between">
              <span className="text-slate-700">{item.product.name} × {item.qty}</span>
              <span className="font-medium">{thb(item.product.price*item.qty)} ฿</span>
            </div>
          ))}
          <div className="border-t my-3"/>
          <div className="flex justify-between text-lg font-bold"><span>รวมทั้งหมด</span><span className="text-blue-600">{thb(total)} ฿</span></div>
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">เริ่มบิลใหม่</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Sell Page — matches go.pospos.co screenshot exactly
   ═══════════════════════════════════════════════════════════════ */
export default function SellPage() {
  const t = useTranslation();
  const ALL_LABEL = t("sell_all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<ProductWithCat[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_LABEL]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_LABEL);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [receipt, setReceipt] = useState<{method:string;no:string}|null>(null);
  const [discount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("store_id", STORE_ID)
      .eq("active", true)
      .order("name");
    if (data) {
      const typed = data as ProductWithCat[];
      setProducts(typed);
      const cats = [ALL_LABEL, ...new Set(typed.map(p => p.categories?.name ?? "อื่นๆ").filter(Boolean))];
      setCategories(cats);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  /* ── Keyboard shortcuts (matches real POSPOS) ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); if (cart.length > 0) setShowPayment(true); }
      if (e.key === "Escape") { setShowPayment(false); setReceipt(null); }
      if (e.ctrlKey && e.key === "e") { e.preventDefault(); setCart([]); }
      if (e.ctrlKey && e.key === "f") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [cart]);

  const filtered = products.filter(p =>
    (category === ALL_LABEL || p.categories?.name === category) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").includes(search))
  );

  const addToCart = (product: ProductWithCat) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };
  const updateQty = (id: string, delta: number) =>
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal - discount;

  const handleConfirmPayment = async (method: string) => {
    const no = `R${Date.now().toString().slice(-6)}`;
    const vat = total * 0.07;
    const { data: sale } = await (supabase.from("sales") as any).insert({
      store_id: STORE_ID, receipt_no: no, total, discount, vat,
      payment_method: method, status: "completed", sold_at: new Date().toISOString(),
    }).select().single();
    if (sale) {
      await (supabase.from("sale_items") as any).insert(
        cart.map(item => ({
          sale_id: sale.id, product_id: item.product.id, name: item.product.name,
          price: item.product.price, cost: item.product.cost, quantity: item.qty,
          subtotal: item.product.price * item.qty,
        }))
      );
      for (const item of cart) {
        await (supabase.from("products") as any).update({ stock: Math.max(0, item.product.stock - item.qty) }).eq("id", item.product.id);
      }
      await loadProducts();
    }
    setShowPayment(false);
    setReceipt({ method, no });
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}

        <main
          className="flex-1 flex flex-col"
          style={{ marginLeft: sidebarOpen ? 200 : 0, height: "calc(100vh - 50px)" }}
        >
          {/* ── Content area: product grid + right panel ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* ═══ LEFT: Products ═══ */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* ── Toolbar (matches screenshot) ── */}
              <div
                className="flex items-center gap-1 px-2 py-2 flex-shrink-0"
                style={{ background: "#f4f4f5", borderBottom: "1px solid #ddd" }}
              >
                {/* Icon buttons */}
                <ToolbarBtn title={t("sell_filter")}><SlidersHorizontal size={16} /></ToolbarBtn>
                <ToolbarBtn title={t("sell_cart")}><ShoppingCart size={16} /></ToolbarBtn>

                {/* Category dropdown */}
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded">
                  <span className="text-[13px]">{t("sell_all")}</span>
                  <ChevronDown size={13} />
                </button>

                <ToolbarBtn title={t("nav_notifications")}><Bell size={16} /></ToolbarBtn>
                <ToolbarBtn title="Grid"><LayoutGrid size={16} /></ToolbarBtn>

                {/* Search bar with blue button */}
                <div className="flex flex-1 ml-1">
                  <button className="flex items-center justify-center px-3 rounded-l-md" style={{ background: "#0d6eb3" }}>
                    <Search size={15} className="text-white" />
                  </button>
                  <input
                    ref={searchRef}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t("sell_search_placeholder")}
                    className="flex-1 px-3 py-2 text-sm border border-l-0 border-slate-300 focus:outline-none focus:border-blue-400"
                    style={{ background: "#fff" }}
                  />
                  <button className="flex items-center justify-center px-2 border border-l-0 border-slate-300 bg-white rounded-r-md">
                    <ChevronDown size={15} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* ── Product grid (dark background, 4 cols, image cards) ── */}
              <div
                className="flex-1 overflow-y-auto p-3"
                style={{ background: "#d2d6dc" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {filtered.map(product => {
                      const inCart = cart.find(i => i.product.id === product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          className={clsx(
                            "relative bg-white text-left shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                            inCart ? "ring-2 ring-blue-400" : ""
                          )}
                          style={{ borderRadius: 2 }}
                        >
                          {/* Product image */}
                          <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100 relative">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* Badge icon (top-right) */}
                            <span
                              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(0,0,0,0.45)" }}
                            >
                              <Percent size={13} className="text-white" />
                            </span>
                            {/* Cart quantity badge */}
                            {inCart && (
                              <span className="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                                {inCart.qty}
                              </span>
                            )}
                          </div>
                          {/* Product info */}
                          <div className="px-2 py-2">
                            <p className="text-[13px] font-medium text-slate-800 leading-tight truncate">{product.name}</p>
                            <p className="text-[14px] font-bold" style={{ color: "#0d6eb3" }}>฿{thb(product.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ═══ RIGHT: Cart / Payment Panel ═══ */}
            <div
              className="flex flex-col flex-shrink-0 border-l"
              style={{ width: 320, background: "#fff" }}
            >
              {/* Top summary line */}
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: "#f8f8f8" }}>
                <span className="text-sm text-slate-500">{t("sell_subtotal")}</span>
                <span className="text-sm font-semibold text-slate-700">{thb(total)} ฿</span>
              </div>

              {/* Large total */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-sm text-slate-500 mb-1">{t("sell_net_total")}</p>
                <p className="text-4xl font-bold" style={{ color: "#0d6eb3" }}>{thb(total)} ฿</p>
              </div>

              {/* Cart items (scrollable, hidden when empty → shows branding) */}
              {cart.length > 0 && (
                <>
                  <div className="border-t mx-4 my-1" />
                  <div className="flex items-center justify-center py-1">
                    <ChevronDown size={18} className="text-slate-300" />
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-2 bg-slate-50 rounded p-2">
                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-slate-200">
                          <img src={getProductImage(item.product)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-slate-800 truncate">{item.product.name}</p>
                          <p className="text-[11px] font-semibold" style={{ color: "#0d6eb3" }}>{thb(item.product.price * item.qty)} ฿</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); updateQty(item.product.id, -1); }}
                            className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"><Minus size={10} /></button>
                          <span className="text-[12px] font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateQty(item.product.id, 1); }}
                            className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"><Plus size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Divider + dropdown arrow (when no cart items) */}
              {cart.length === 0 && (
                <>
                  <div className="border-t mx-4 my-2" />
                  <div className="flex items-center justify-center py-1">
                    <ChevronDown size={18} className="text-slate-300" />
                  </div>
                </>
              )}

              {/* Payment button + 3-dot menu */}
              <div className="px-4 py-3 flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => cart.length > 0 && setShowPayment(true)}
                    disabled={cart.length === 0}
                    className="flex-1 py-4 rounded-2xl text-center font-bold text-xl transition-colors disabled:opacity-60"
                    style={{ background: "#b3ddf5", color: "#0d6eb3" }}
                  >
                    {t("sell_pay")}
                    <span className="block text-sm font-normal mt-0.5">( F12 )</span>
                  </button>
                  <button className="flex items-center justify-center px-2 text-slate-400 hover:text-slate-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1" />
            </div>
          </div>

          {/* ═══ BOTTOM ACTION BAR (matches screenshot) ═══ */}
          <div
            className="flex items-center gap-2 px-3 py-2 flex-shrink-0 border-t"
            style={{ background: "#f4f4f5" }}
          >
            <ActionBtn
              icon={<Trash2 size={16} />}
              label={t("sell_clear")}
              shortcut="Ctrl+E"
              color="#ef4444"
              textColor="#fff"
              onClick={() => setCart([])}
            />
            <ActionBtn
              icon={<Users size={16} />}
              label={t("sell_customer")}
              shortcut="Ctrl+M"
              color="#fff"
              textColor="#555"
              border
            />
            <ActionBtn
              icon={<Archive size={16} />}
              label={t("sell_drawer")}
              shortcut="Ctrl+O"
              color="#fff"
              textColor="#555"
              border
            />
            <ActionBtn
              icon={<PauseCircle size={16} />}
              label={t("sell_hold")}
              shortcut="Ctrl+P"
              color="#fff"
              textColor="#555"
              border
            />
            <ActionBtn
              icon={<DollarSign size={16} />}
              label={t("sell_summary")}
              color="#fff"
              textColor="#555"
              border
            />
            {/* 3-dot overflow */}
            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50">
              <MoreVertical size={18} />
            </button>
          </div>
        </main>
      </div>

      {showPayment && <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirm={handleConfirmPayment} />}
      {receipt && <ReceiptModal cart={cart} total={total} method={receipt.method} receiptNo={receipt.no} onClose={() => { setReceipt(null); setCart([]); }} />}
    </>
  );
}

/* ── Toolbar icon button ── */
function ToolbarBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button
      title={title}
      className="flex items-center justify-center w-9 h-9 rounded text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
    >
      {children}
    </button>
  );
}

/* ── Bottom action bar button ── */
function ActionBtn({
  icon, label, shortcut, color, textColor, border, onClick,
}: {
  icon: React.ReactNode; label: string; shortcut?: string;
  color: string; textColor: string; border?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
      style={{
        background: color,
        color: textColor,
        border: border ? "1px solid #ddd" : "none",
      }}
    >
      {icon}
      <div className="text-left">
        <span className="block leading-tight">{label}</span>
        {shortcut && <span className="block text-[10px] opacity-60 leading-tight">({shortcut})</span>}
      </div>
    </button>
  );
}
