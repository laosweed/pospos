"use client";

import PageShell from "@/components/PageShell";
import { ExternalLink, Star } from "lucide-react";

interface Partner {
  id: string; name: string; category: string; desc: string;
  rating: number; logo: string; tag: string; tagColor: string;
  url?: string;
}

const PARTNERS: Partner[] = [
  { id:"p1",  name:"Grab",          category:"Delivery",       logo:"🟢", rating:4.8, tag:"เชื่อมต่อแล้ว", tagColor:"emerald", desc:"รับออเดอร์จาก GrabFood โดยตรง ซิงค์เมนูอัตโนมัติ" },
  { id:"p2",  name:"Foodpanda",     category:"Delivery",       logo:"🟣", rating:4.6, tag:"เชื่อมต่อแล้ว", tagColor:"emerald", desc:"รับออเดอร์จาก Foodpanda จัดการในระบบเดียว" },
  { id:"p3",  name:"LINE MAN",      category:"Delivery",       logo:"🟡", rating:4.5, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"เชื่อมต่อ LINE MAN Wongnai รับออเดอร์ได้ทันที" },
  { id:"p4",  name:"Shopee",        category:"E-Commerce",     logo:"🟠", rating:4.7, tag:"เชื่อมต่อแล้ว", tagColor:"emerald", desc:"ซิงค์สต็อกและออเดอร์จาก Shopee อัตโนมัติ 24 ชั่วโมง" },
  { id:"p5",  name:"Lazada",        category:"E-Commerce",     logo:"🔵", rating:4.5, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"เชื่อมต่อ Lazada Seller Center จัดการสต็อกรวม" },
  { id:"p6",  name:"LINE Shopping", category:"E-Commerce",     logo:"🟩", rating:4.3, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"เปิดร้านบน LINE Shopping ดึงสินค้าจาก POS โดยตรง" },
  { id:"p7",  name:"K PLUS",        category:"การชำระเงิน",    logo:"🏦", rating:4.9, tag:"เชื่อมต่อแล้ว", tagColor:"emerald", desc:"รับชำระเงินผ่าน PromptPay และ KBank บัตรเครดิต" },
  { id:"p8",  name:"SCB Easy",      category:"การชำระเงิน",    logo:"💜", rating:4.7, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"รับชำระเงินผ่าน SCB QR Code และ Scan to Pay" },
  { id:"p9",  name:"Omise",         category:"การชำระเงิน",    logo:"🔶", rating:4.6, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"Payment gateway รองรับบัตรทุกประเภท Visa/Mastercard" },
  { id:"p10", name:"QuickBooks",    category:"บัญชี",           logo:"🟦", rating:4.4, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"ส่งข้อมูลยอดขายและค่าใช้จ่ายเข้า QuickBooks อัตโนมัติ" },
  { id:"p11", name:"FlowAccount",   category:"บัญชี",           logo:"🌊", rating:4.6, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"เชื่อมต่อโปรแกรมบัญชี FlowAccount เฉพาะไทย" },
  { id:"p12", name:"Mailchimp",     category:"การตลาด",        logo:"🐒", rating:4.3, tag:"พร้อมใช้งาน",  tagColor:"blue",    desc:"ส่ง email marketing ให้ลูกค้า VIP โดยอัตโนมัติ" },
];

const TAG_COLORS: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

const CATEGORIES = ["ทั้งหมด", "Delivery", "E-Commerce", "การชำระเงิน", "บัญชี", "การตลาด"];

export default function PartnersPage() {
  return (
    <PageShell>
      <div className="p-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">พาร์ทเนอร์ & การเชื่อมต่อ</h1>
          <p className="text-sm text-slate-400 mt-1">เชื่อมต่อกับแพลตฟอร์มชั้นนำเพื่อขยายธุรกิจของคุณ</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "พาร์ทเนอร์ทั้งหมด", value: PARTNERS.length.toString(), color: "text-slate-800" },
            { label: "เชื่อมต่อแล้ว", value: PARTNERS.filter(p=>p.tag==="เชื่อมต่อแล้ว").length.toString(), color: "text-emerald-600" },
            { label: "พร้อมใช้งาน", value: PARTNERS.filter(p=>p.tag==="พร้อมใช้งาน").length.toString(), color: "text-blue-600" },
            { label: "หมวดหมู่", value: "5", color: "text-purple-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 mb-1">{s.label}</p>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <span key={c} className="px-3 py-1.5 bg-white rounded-xl text-[13px] font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors">
              {c}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {PARTNERS.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                    {p.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{p.name}</h3>
                    <p className="text-[11px] text-slate-400">{p.category}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[p.tagColor]}`}>
                  {p.tag}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[12px] font-medium text-slate-600">{p.rating}</span>
                </div>
                <button className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                  p.tag === "เชื่อมต่อแล้ว"
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}>
                  {p.tag === "เชื่อมต่อแล้ว" ? "จัดการ" : "เชื่อมต่อ"}
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
