"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Trash2, Plus, Minus, X, CreditCard, Banknote, QrCode } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import type { Product } from "@/lib/supabase/types";

interface CartItem { product: Product; qty: number }
type ProductWithCat = Product & { categories: { name: string } | null };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

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

export default function SellPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<ProductWithCat[]>([]);
  const [categories, setCategories] = useState<string[]>(["ทั้งหมด"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [receipt, setReceipt] = useState<{method:string;no:string}|null>(null);
  const [discount] = useState(0);

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
      const cats = ["ทั้งหมด", ...new Set(typed.map(p => p.categories?.name ?? "อื่นๆ").filter(Boolean))];
      setCategories(cats);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==="F1"){e.preventDefault();if(cart.length>0)setShowPayment(true);}
      if (e.key==="Escape"){setShowPayment(false);setReceipt(null);}
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  }, [cart]);

  const filtered = products.filter(p=>
    (category==="ทั้งหมด"||p.categories?.name===category)&&
    (search===""||p.name.toLowerCase().includes(search.toLowerCase())||(p.sku??"").includes(search))
  );

  const addToCart = (product: ProductWithCat) => {
    setCart(prev=>{
      const ex=prev.find(i=>i.product.id===product.id);
      if(ex)return prev.map(i=>i.product.id===product.id?{...i,qty:i.qty+1}:i);
      return [...prev,{product,qty:1}];
    });
  };
  const updateQty = (id:string,delta:number) => setCart(prev=>prev.map(i=>i.product.id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0));

  const subtotal = cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const vat = (subtotal-discount)*0.07;
  const total = subtotal-discount;

  const handleConfirmPayment = async (method:string) => {
    const no = `R${Date.now().toString().slice(-6)}`;
    const {data:sale} = await (supabase.from("sales") as any).insert({
      store_id:STORE_ID, receipt_no:no, total, discount, vat,
      payment_method:method, status:"completed", sold_at:new Date().toISOString(),
    }).select().single();
    if (sale) {
      await (supabase.from("sale_items") as any).insert(
        cart.map(item=>({
          sale_id:sale.id, product_id:item.product.id, name:item.product.name,
          price:item.product.price, cost:item.product.cost, quantity:item.qty,
          subtotal:item.product.price*item.qty,
        }))
      );
      for (const item of cart) {
        await (supabase.from("products") as any).update({stock:Math.max(0,item.product.stock-item.qty)}).eq("id",item.product.id);
      }
      await loadProducts();
    }
    setShowPayment(false);
    setReceipt({method,no});
  };

  return (
    <>
      <Navbar onToggleSidebar={()=>setSidebarOpen(v=>!v)}/>
      <div className="flex" style={{marginTop:50}}>
        {sidebarOpen&&<Sidebar/>}
        <main className="flex-1 flex h-[calc(100vh-50px)]" style={{marginLeft:sidebarOpen?230:0,background:"#edf1f5"}}>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white px-4 py-3 shadow-sm flex-shrink-0">
              <div className="flex gap-3 mb-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาสินค้า หรือสแกนบาร์โค้ด..."
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"/>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map(cat=>(
                  <button key={cat} onClick={()=>setCategory(cat)}
                    className={clsx("flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                      category===cat?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading?(
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/>
                </div>
              ):(
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                  {filtered.map(product=>{
                    const inCart=cart.find(i=>i.product.id===product.id);
                    return (
                      <button key={product.id} onClick={()=>addToCart(product)}
                        className={clsx("relative bg-white rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border-2",
                          inCart?"border-blue-400":"border-transparent")}>
                        <div className="text-4xl mb-2 text-center">{product.emoji}</div>
                        <p className="text-[13px] font-medium text-slate-800 leading-tight mb-1">{product.name}</p>
                        <p className="text-[15px] font-bold text-blue-600">{thb(product.price)} ฿</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">คงเหลือ {product.stock}</p>
                        {inCart&&<span className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">{inCart.qty}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="w-[320px] flex-shrink-0 flex flex-col bg-white shadow-lg">
            <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="font-bold text-slate-800">รายการสั่งซื้อ</h2>
              {cart.length>0&&<button onClick={()=>setCart([])} className="flex items-center gap-1 text-red-400 hover:text-red-500 text-[12px]"><Trash2 size={13}/>ล้างทั้งหมด</button>}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length===0?(
                <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-2"><span className="text-5xl">🛒</span><p className="text-sm">ยังไม่มีรายการ</p></div>
              ):cart.map(item=>(
                <div key={item.product.id} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5">
                  <span className="text-2xl">{item.product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[12px] text-blue-600 font-semibold">{thb(item.product.price*item.qty)} ฿</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={()=>updateQty(item.product.id,-1)} className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"><Minus size={11}/></button>
                    <span className="text-[13px] font-bold w-5 text-center">{item.qty}</span>
                    <button onClick={()=>updateQty(item.product.id,1)} className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"><Plus size={11}/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4 space-y-2 flex-shrink-0">
              <div className="flex justify-between text-sm text-slate-500"><span>ยอดรวม ({cart.reduce((s,i)=>s+i.qty,0)} รายการ)</span><span>{thb(subtotal)} ฿</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>VAT 7%</span><span>{thb(vat)} ฿</span></div>
              <div className="flex justify-between font-bold text-[18px] pt-2 border-t"><span>ยอดสุทธิ</span><span className="text-blue-600">{thb(total)} ฿</span></div>
              <button onClick={()=>cart.length>0&&setShowPayment(true)} disabled={cart.length===0}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 disabled:opacity-40 transition-colors mt-1">
                ชำระเงิน [F1]
              </button>
            </div>
          </div>
        </main>
      </div>
      {showPayment&&<PaymentModal total={total} onClose={()=>setShowPayment(false)} onConfirm={handleConfirmPayment}/>}
      {receipt&&<ReceiptModal cart={cart} total={total} method={receipt.method} receiptNo={receipt.no} onClose={()=>{setReceipt(null);setCart([]);}}/>}
    </>
  );
}
