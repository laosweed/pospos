"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Plus, Edit2, Trash2, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Option { name: string; extra: number }
interface ToppingGroup {
  id: string; name: string; required: boolean; multi: boolean;
  min: number; max: number; options: Option[];
  products: string[];
}

const DEMO: ToppingGroup[] = [
  {
    id:"t1", name:"ขนาด", required:true, multi:false, min:1, max:1,
    options:[{name:"เล็ก",extra:0},{name:"กลาง",extra:10},{name:"ใหญ่",extra:20}],
    products:["กาแฟลาเต้","ชานมไข่มุก"],
  },
  {
    id:"t2", name:"ความหวาน", required:true, multi:false, min:1, max:1,
    options:[{name:"ไม่หวาน",extra:0},{name:"หวานน้อย",extra:0},{name:"หวานปกติ",extra:0},{name:"หวานมาก",extra:0}],
    products:["ชานมไข่มุก","สตรอว์เบอร์รี่สมูทตี้"],
  },
  {
    id:"t3", name:"ท็อปปิ้งเพิ่ม", required:false, multi:true, min:0, max:3,
    options:[{name:"ไข่มุก",extra:10},{name:"เจลลี่",extra:10},{name:"วิปครีม",extra:15},{name:"ช็อกโกแลตชิพ",extra:15}],
    products:["ชานมไข่มุก","กาแฟลาเต้"],
  },
  {
    id:"t4", name:"ครีม/นม", required:false, multi:false, min:0, max:1,
    options:[{name:"นมสด",extra:0},{name:"นมข้น",extra:0},{name:"ครีมสด",extra:15},{name:"นมอัลมอนด์",extra:20}],
    products:["กาแฟลาเต้"],
  },
];

function thb(v: number) { return v > 0 ? `+${v}` : `${v}`; }

export default function ToppingsPage() {
  const [groups, setGroups] = useState(DEMO);
  const [open, setOpen] = useState<string|null>(null);
  const [editing, setEditing] = useState<ToppingGroup|null>(null);

  const deleteGroup = (id: string) => setGroups(prev => prev.filter(g => g.id !== id));

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">ท็อปปิ้ง / ตัวเลือก</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15} /> เพิ่มกลุ่มตัวเลือก
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">กลุ่มตัวเลือกทั้งหมด</p>
            <p className="text-[22px] font-bold text-blue-600">{groups.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">ตัวเลือกทั้งหมด</p>
            <p className="text-[22px] font-bold text-purple-600">{groups.reduce((s,g)=>s+g.options.length,0)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">บังคับเลือก</p>
            <p className="text-[22px] font-bold text-amber-500">{groups.filter(g=>g.required).length}</p>
          </div>
        </div>

        <div className="space-y-3">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"
                onClick={() => setOpen(open===group.id ? null : group.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{group.name}</span>
                    {group.required && <span className="text-[11px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">บังคับ</span>}
                    {group.multi && <span className="text-[11px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">เลือกได้หลาย</span>}
                  </div>
                  <p className="text-[12px] text-slate-400">{group.options.length} ตัวเลือก · สินค้า: {group.products.join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={e=>{e.stopPropagation();setEditing(group)}} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg"><Edit2 size={13}/></button>
                  <button onClick={e=>{e.stopPropagation();deleteGroup(group.id)}} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 size={13}/></button>
                </div>
                <ChevronDown size={16} className={clsx("text-slate-400 transition-transform flex-shrink-0", open===group.id && "rotate-180")} />
              </button>

              {open === group.id && (
                <div className="border-t border-slate-100 px-5 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    {group.options.map((opt, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                        <span className="text-sm text-slate-700">{opt.name}</span>
                        <span className={clsx("text-[12px] font-semibold", opt.extra>0?"text-blue-600":"text-slate-400")}>
                          {opt.extra > 0 ? `+${opt.extra} ฿` : "ฟรี"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
