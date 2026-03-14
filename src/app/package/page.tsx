"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import clsx from "clsx";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    price: 299,
    period: "เดือน",
    color: "blue",
    desc: "เหมาะสำหรับร้านค้าขนาดเล็ก",
    features: [
      "1 เครื่อง POS",
      "สินค้าสูงสุด 500 รายการ",
      "รายงานพื้นฐาน",
      "บันทึกการขาย",
      "สต็อกสินค้า",
      "รองรับ 1 สาขา",
    ],
    notIncluded: ["ระบบสมาชิก", "โปรโมชั่น", "รายงานขั้นสูง", "API"],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    price: 699,
    period: "เดือน",
    color: "purple",
    desc: "เหมาะสำหรับร้านค้าที่กำลังเติบโต",
    features: [
      "3 เครื่อง POS",
      "สินค้าไม่จำกัด",
      "รายงานขั้นสูง",
      "ระบบสมาชิก & แต้ม",
      "โปรโมชั่น & คูปอง",
      "รองรับ 3 สาขา",
      "บิลออนไลน์",
      "แจ้งเตือน LINE",
    ],
    notIncluded: ["API เข้าถึง", "White Label"],
    current: true,
    badge: "แพ็กเกจปัจจุบัน",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: 1999,
    period: "เดือน",
    color: "amber",
    desc: "สำหรับธุรกิจขนาดใหญ่ หลายสาขา",
    features: [
      "เครื่อง POS ไม่จำกัด",
      "สินค้าไม่จำกัด",
      "รายงานทุกรูปแบบ",
      "ระบบสมาชิก & แต้ม",
      "โปรโมชั่น & คูปอง",
      "สาขาไม่จำกัด",
      "API เข้าถึง",
      "White Label",
      "ผู้จัดการบัญชีส่วนตัว",
      "SLA 99.9%",
    ],
    notIncluded: [],
    current: false,
  },
];

const COLOR_MAP: Record<string, Record<string, string>> = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600",   badge: "bg-blue-600 text-white",   btn: "bg-blue-600 hover:bg-blue-700 text-white",   border: "border-blue-200" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", badge: "bg-purple-600 text-white", btn: "bg-purple-600 hover:bg-purple-700 text-white", border: "border-purple-300" },
  amber:  { bg: "bg-amber-50",  icon: "bg-amber-100 text-amber-600",  badge: "bg-amber-500 text-white",  btn: "bg-amber-500 hover:bg-amber-600 text-white",  border: "border-amber-200" },
};

export default function PackagePage() {
  const [billing, setBilling] = useState<"monthly"|"yearly">("monthly");

  return (
    <PageShell>
      <div className="p-5 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">เลือกแพ็กเกจ</h1>
          <p className="text-slate-500">เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ</p>
          <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 mt-2">
            <button onClick={() => setBilling("monthly")}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                billing==="monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}>
              รายเดือน
            </button>
            <button onClick={() => setBilling("yearly")}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                billing==="yearly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}>
              รายปี <span className="text-emerald-500 text-[11px] font-semibold">ประหยัด 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            const c = COLOR_MAP[plan.color];
            const price = billing === "yearly" ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <div key={plan.id}
                className={clsx("bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col relative",
                  plan.current ? c.border : "border-transparent")}>
                {plan.badge && (
                  <div className={clsx("absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold", c.badge)}>
                    {plan.badge}
                  </div>
                )}
                <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", c.icon)}>
                  <Icon size={22} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h2>
                <p className="text-[12px] text-slate-400 mb-4">{plan.desc}</p>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-slate-800">{price.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm"> ฿/{plan.period}</span>
                </div>
                <div className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                  {plan.notIncluded.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-3.5 h-3.5 flex-shrink-0 text-center leading-none">–</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button className={clsx("w-full py-2.5 rounded-xl font-semibold text-sm transition-colors", c.btn)}>
                  {plan.current ? "แพ็กเกจปัจจุบัน" : "เลือกแพ็กเกจนี้"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm max-w-5xl mx-auto">
          <h3 className="font-semibold text-slate-800 mb-4">ข้อมูลการสมัคร</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              ["แพ็กเกจปัจจุบัน", "Pro"],
              ["วันที่เริ่มใช้", "01/02/2026"],
              ["ต่ออายุครั้งถัดไป", "01/04/2026"],
              ["วิธีชำระ", "บัตรเครดิต **** 1234"],
              ["จำนวนเครื่อง POS", "2 / 3 เครื่อง"],
              ["จำนวนสาขา", "1 / 3 สาขา"],
            ].map(([k,v]) => (
              <div key={k}>
                <p className="text-slate-400 text-[12px]">{k}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
