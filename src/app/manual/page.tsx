"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import clsx from "clsx";

const SECTIONS = [
  {
    id:"s1", icon:"🚀", title:"เริ่มต้นใช้งาน",
    articles:[
      { title:"การตั้งค่าร้านค้าครั้งแรก", time:"5 นาที" },
      { title:"การเพิ่มสินค้าและหมวดหมู่", time:"10 นาที" },
      { title:"การเพิ่มพนักงานและสิทธิ์การใช้งาน", time:"5 นาที" },
      { title:"การตั้งค่าเครื่องพิมพ์", time:"10 นาที" },
    ],
  },
  {
    id:"s2", icon:"💳", title:"หน้าขาย",
    articles:[
      { title:"วิธีขายสินค้า", time:"5 นาที" },
      { title:"การใช้ส่วนลดและโปรโมชั่น", time:"5 นาที" },
      { title:"การรับชำระเงินหลายรูปแบบ", time:"8 นาที" },
      { title:"การยกเลิกบิล", time:"3 นาที" },
    ],
  },
  {
    id:"s3", icon:"📦", title:"สต็อกสินค้า",
    articles:[
      { title:"การจัดการสต็อก", time:"8 นาที" },
      { title:"การรับสินค้าเข้า (นำเข้า)", time:"5 นาที" },
      { title:"การเบิก-คืนสินค้า", time:"5 นาที" },
      { title:"การตั้งค่าแจ้งเตือนสต็อกต่ำ", time:"3 นาที" },
    ],
  },
  {
    id:"s4", icon:"📊", title:"รายงาน",
    articles:[
      { title:"การดูรายงานยอดขาย", time:"5 นาที" },
      { title:"การออกรายงานภาษี", time:"8 นาที" },
      { title:"การส่งออกข้อมูล Excel", time:"3 นาที" },
    ],
  },
];

export default function ManualPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string|null>(null);

  const allArticles = SECTIONS.flatMap(s => s.articles.map(a => ({ ...a, section:s.title, icon:s.icon })));
  const filtered = search ? allArticles.filter(a => a.title.includes(search)) : [];

  return (
    <PageShell>
      <div className="p-5 space-y-5">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <BookOpen size={40} className="mx-auto mb-3 opacity-80"/>
          <h1 className="text-2xl font-bold mb-2">ศูนย์ช่วยเหลือ POSPOS</h1>
          <p className="text-blue-200 mb-5">ค้นหาวิธีใช้งานระบบ</p>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาบทความ..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none shadow-lg"/>
          </div>
        </div>

        {search && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b text-sm font-medium text-slate-500">
              ผลการค้นหา "{search}" ({filtered.length} บทความ)
            </div>
            {filtered.map((a,i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                <span className="text-xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="text-[11px] text-slate-400">{a.section} · อ่าน {a.time}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300"/>
              </div>
            ))}
          </div>
        )}

        {!search && (
          <div className="grid grid-cols-2 gap-4">
            {SECTIONS.map(section => (
              <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="font-semibold text-slate-800">{section.title}</h2>
                </div>
                <div>
                  {section.articles.map((article,i) => (
                    <div key={i} className="flex items-center gap-2 px-5 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{article.title}</p>
                        <p className="text-[11px] text-slate-400">อ่านประมาณ {article.time}</p>
                      </div>
                      <ChevronRight size={13} className="text-slate-300 flex-shrink-0"/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
