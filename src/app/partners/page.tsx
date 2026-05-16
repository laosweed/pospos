"use client";

import PageShell from "@/components/PageShell";
import { ExternalLink, Star } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface Partner {
  id: string; name: string; category: string; desc: string;
  rating: number; logo: string; tagType: "connected" | "ready";
  url?: string;
}

const PARTNERS: Partner[] = [
  { id:"p1",  name:"Grab",          category:"Delivery",    logo:"🟢", rating:4.8, tagType:"connected", desc:"รับออเดอร์จาก GrabFood โดยตรง ซิงค์เมนูอัตโนมัติ" },
  { id:"p2",  name:"Foodpanda",     category:"Delivery",    logo:"🟣", rating:4.6, tagType:"connected", desc:"รับออเดอร์จาก Foodpanda จัดการในระบบเดียว" },
  { id:"p3",  name:"LINE MAN",      category:"Delivery",    logo:"🟡", rating:4.5, tagType:"ready",     desc:"เชื่อมต่อ LINE MAN Wongnai รับออเดอร์ได้ทันที" },
  { id:"p4",  name:"Shopee",        category:"E-Commerce",  logo:"🟠", rating:4.7, tagType:"connected", desc:"ซิงค์สต็อกและออเดอร์จาก Shopee อัตโนมัติ 24 ชั่วโมง" },
  { id:"p5",  name:"Lazada",        category:"E-Commerce",  logo:"🔵", rating:4.5, tagType:"ready",     desc:"เชื่อมต่อ Lazada Seller Center จัดการสต็อกรวม" },
  { id:"p6",  name:"LINE Shopping", category:"E-Commerce",  logo:"🟩", rating:4.3, tagType:"ready",     desc:"เปิดร้านบน LINE Shopping ดึงสินค้าจาก POS โดยตรง" },
  { id:"p7",  name:"K PLUS",        category:"Payment",     logo:"🏦", rating:4.9, tagType:"connected", desc:"รับชำระเงินผ่าน PromptPay และ KBank บัตรเครดิต" },
  { id:"p8",  name:"SCB Easy",      category:"Payment",     logo:"💜", rating:4.7, tagType:"ready",     desc:"รับชำระเงินผ่าน SCB QR Code และ Scan to Pay" },
  { id:"p9",  name:"Omise",         category:"Payment",     logo:"🔶", rating:4.6, tagType:"ready",     desc:"Payment gateway รองรับบัตรทุกประเภท Visa/Mastercard" },
  { id:"p10", name:"QuickBooks",    category:"Accounting",  logo:"🟦", rating:4.4, tagType:"ready",     desc:"ส่งข้อมูลยอดขายและค่าใช้จ่ายเข้า QuickBooks อัตโนมัติ" },
  { id:"p11", name:"FlowAccount",   category:"Accounting",  logo:"🌊", rating:4.6, tagType:"ready",     desc:"เชื่อมต่อโปรแกรมบัญชี FlowAccount เฉพาะไทย" },
  { id:"p12", name:"Mailchimp",     category:"Marketing",   logo:"🐒", rating:4.3, tagType:"ready",     desc:"ส่ง email marketing ให้ลูกค้า VIP โดยอัตโนมัติ" },
];

export default function PartnersPage() {
  const t = useTranslation();

  const TAG_COLORS: Record<string, string> = {
    connected: "bg-emerald-50 text-emerald-600",
    ready: "bg-blue-50 text-blue-600",
  };

  return (
    <PageShell>
      <div className="p-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("partners_title")}</h1>
          <p className="text-sm text-slate-400 mt-1">{t("partners_subtitle")}</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: t("partners_total"), value: PARTNERS.length.toString(), color: "text-slate-800" },
            { label: t("partners_connected"), value: PARTNERS.filter(p=>p.tagType==="connected").length.toString(), color: "text-emerald-600" },
            { label: t("partners_ready"), value: PARTNERS.filter(p=>p.tagType==="ready").length.toString(), color: "text-blue-600" },
            { label: t("partners_categories"), value: "5", color: "text-purple-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 mb-1">{s.label}</p>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

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
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[p.tagType]}`}>
                  {p.tagType === "connected" ? t("partners_connected") : t("partners_ready")}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[12px] font-medium text-slate-600">{p.rating}</span>
                </div>
                <button className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                  p.tagType === "connected"
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}>
                  {p.tagType === "connected" ? t("partners_manage") : t("partners_connect")}
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
