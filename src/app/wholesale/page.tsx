"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Edit2 } from "lucide-react";

const PRODUCTS = [
  { id:"p1", name:"ครัวซองต์เนย", emoji:"🥐", retail:45,  w1:40,  w2:35,  w3:30  },
  { id:"p2", name:"ขนมปังโฮลวีท", emoji:"🍞", retail:35,  w1:30,  w2:28,  w3:25  },
  { id:"p3", name:"เค้กช็อกโกแลต",emoji:"🎂", retail:180, w1:160, w2:145, w3:130 },
  { id:"p4", name:"ชีสเค้ก",      emoji:"🍰", retail:160, w1:145, w2:130, w3:115 },
  { id:"p5", name:"กาแฟลาเต้",    emoji:"☕", retail:65,  w1:58,  w2:52,  w3:45  },
  { id:"p6", name:"ชานมไข่มุก",   emoji:"🧋", retail:70,  w1:62,  w2:55,  w3:50  },
];

const TIERS = [
  { key:"w1", label:"ขายส่ง Tier 1", min:"6-11 ชิ้น",  color:"#3b82f6" },
  { key:"w2", label:"ขายส่ง Tier 2", min:"12-23 ชิ้น", color:"#8b5cf6" },
  { key:"w3", label:"ขายส่ง Tier 3", min:"24+ ชิ้น",   color:"#10b981" },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function WholesalePage() {
  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">ราคาขายส่ง</h1>

        <div className="grid grid-cols-3 gap-3">
          {TIERS.map(t => (
            <div key={t.key} className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderLeftColor:t.color }}>
              <p className="font-semibold text-slate-700">{t.label}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">{t.min}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-slate-500 font-medium">สินค้า</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">ราคาปลีก</th>
                {TIERS.map(t => (
                  <th key={t.key} className="text-right px-4 py-3 font-medium" style={{ color:t.color }}>{t.label}</th>
                ))}
                <th className="px-4 py-3"/>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.emoji}</span>
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{thb(p.retail)} ฿</td>
                  {TIERS.map(t => (
                    <td key={t.key} className="px-4 py-3 text-right font-semibold" style={{ color:t.color }}>
                      {thb((p as Record<string,number>)[t.key])} ฿
                      <span className="text-[10px] text-slate-400 ml-1">
                        (-{Math.round((1-(p as Record<string,number>)[t.key]/p.retail)*100)}%)
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg"><Edit2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
