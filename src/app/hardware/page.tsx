"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Monitor, Printer, Wifi, ShoppingCart, Star } from "lucide-react";
import clsx from "clsx";

interface Product {
  id: string; name: string; category: string; price: number;
  originalPrice?: number; rating: number; reviews: number;
  badge?: string; desc: string; img: string;
}

const CATEGORIES = ["ทั้งหมด", "เครื่อง POS", "เครื่องพิมพ์", "อุปกรณ์เสริม"];

const PRODUCTS: Product[] = [
  { id:"h1", name:"POSPOS Terminal Pro", category:"เครื่อง POS", price:12900, originalPrice:14900, rating:4.8, reviews:124, badge:"ขายดี", desc:"หน้าจอสัมผัส 15.6\" Full HD พร้อม Windows 11 Pro", img:"🖥️" },
  { id:"h2", name:"POSPOS Mini Stand", category:"เครื่อง POS", price:8500, rating:4.5, reviews:67, desc:"หน้าจอสัมผัส 10\" แบบพกพา เหมาะสำหรับร้านขนาดเล็ก", img:"📱" },
  { id:"h3", name:"POSPOS Pad Lite", category:"เครื่อง POS", price:6900, originalPrice:7500, rating:4.3, reviews:43, badge:"ลดราคา", desc:"แท็บเล็ต Android 10\" พร้อม POS Stand ปรับระดับได้", img:"📲" },
  { id:"h4", name:"Thermal Printer 80mm", category:"เครื่องพิมพ์", price:2900, rating:4.7, reviews:215, badge:"แนะนำ", desc:"พิมพ์ใบเสร็จความเร็วสูง 250mm/s รองรับ USB/LAN/WiFi", img:"🖨️" },
  { id:"h5", name:"Label Printer Mini", category:"เครื่องพิมพ์", price:1900, rating:4.4, reviews:88, desc:"พิมพ์ป้ายราคา บาร์โค้ด ขนาด 40mm", img:"🏷️" },
  { id:"h6", name:"Barcode Scanner 2D", category:"อุปกรณ์เสริม", price:1200, originalPrice:1500, rating:4.6, reviews:156, badge:"ลดราคา", desc:"สแกน 1D/2D QR Code ทุกชนิด มีสาย USB + ไร้สาย", img:"📡" },
  { id:"h7", name:"Cash Drawer Standard", category:"อุปกรณ์เสริม", price:1800, rating:4.5, reviews:92, desc:"ลิ้นชักเงินสด 5 ช่องธนบัตร 8 ช่องเหรียญ ทนทาน", img:"💰" },
  { id:"h8", name:"Customer Display 2×20", category:"อุปกรณ์เสริม", price:2200, rating:4.2, reviews:38, desc:"จอแสดงผลลูกค้า 2 บรรทัด 20 ตัวอักษร USB", img:"📺" },
  { id:"h9", name:"WiFi Router PoS Grade", category:"อุปกรณ์เสริม", price:2500, rating:4.6, reviews:71, badge:"แนะนำ", desc:"เราเตอร์ WiFi 6 สำหรับ POS โดยเฉพาะ เสถียร latency ต่ำ", img:"📶" },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function HardwarePage() {
  const [category, setCategory] = useState("ทั้งหมด");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = category === "ทั้งหมด" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

  const addToCart = (id: string) => setCart(prev => [...prev, id]);
  const inCart = (id: string) => cart.includes(id);

  return (
    <PageShell>
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">อุปกรณ์ฮาร์ดแวร์</h1>
            <p className="text-sm text-slate-400 mt-0.5">อุปกรณ์ POS คุณภาพสูง พร้อมรับประกัน</p>
          </div>
          <button className="relative flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <ShoppingCart size={15} />
            ตะกร้า
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={clsx("px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-1.5 transition-colors",
                category===c ? "bg-blue-600 text-white" : "bg-white text-slate-600 shadow-sm hover:bg-slate-50")}>
              {c === "เครื่อง POS" && <Monitor size={12} />}
              {c === "เครื่องพิมพ์" && <Printer size={12} />}
              {c === "อุปกรณ์เสริม" && <Wifi size={12} />}
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 h-36 flex items-center justify-center text-5xl relative">
                {p.img}
                {p.badge && (
                  <span className={clsx("absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                    p.badge==="ขายดี"?"bg-amber-100 text-amber-600":
                    p.badge==="แนะนำ"?"bg-blue-100 text-blue-600":
                    "bg-red-100 text-red-500")}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] text-slate-400 mb-1">{p.category}</p>
                <h3 className="font-semibold text-slate-800 mb-1">{p.name}</h3>
                <p className="text-[12px] text-slate-500 mb-2 leading-relaxed">{p.desc}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-[12px] font-medium text-slate-700">{p.rating}</span>
                  <span className="text-[11px] text-slate-400">({p.reviews})</span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-lg font-bold text-slate-800">{thb(p.price)} ฿</span>
                  {p.originalPrice && (
                    <span className="text-[12px] text-slate-400 line-through">{thb(p.originalPrice)} ฿</span>
                  )}
                </div>
                <button onClick={() => addToCart(p.id)} disabled={inCart(p.id)}
                  className={clsx("w-full py-2 rounded-xl text-sm font-semibold transition-colors",
                    inCart(p.id) ? "bg-emerald-50 text-emerald-600 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700")}>
                  {inCart(p.id) ? "✓ เพิ่มแล้ว" : "เพิ่มในตะกร้า"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
