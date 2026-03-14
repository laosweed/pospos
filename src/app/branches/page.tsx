"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Plus, Edit2, MapPin, Phone } from "lucide-react";
import clsx from "clsx";

const BRANCHES = [
  { id:"b1", name:"สาขาสุขุมวิท",  code:"SKV", address:"123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพ 10110", phone:"02-111-2222", manager:"ชนิ่น เกษมทรัพย์", staff:5, isMain:true,  revenue:185000, active:true },
  { id:"b2", name:"สาขาสีลม",      code:"SLM", address:"456 ถ.สีลม แขวงสีลม กรุงเทพ 10500",      phone:"02-333-4444", manager:"สมหมาย ดีงาม",     staff:3, isMain:false, revenue:92000,  active:true },
  { id:"b3", name:"สาขาอโศก",      code:"ASK", address:"789 ถ.อโศก แขวงวัฒนา กรุงเทพ 10110",    phone:"02-555-6666", manager:"วันดี รักงาน",      staff:4, isMain:false, revenue:120000, active:true },
];

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function BranchesPage() {
  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">สาขา</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> เพิ่มสาขา
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {BRANCHES.map(b => (
            <div key={b.id} className={clsx("bg-white rounded-2xl p-5 shadow-sm border-t-4",
              b.isMain?"border-blue-500":"border-slate-200"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{b.name}</h3>
                    {b.isMain && <span className="text-[11px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">หลัก</span>}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{b.code}</span>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg"><Edit2 size={14}/></button>
              </div>
              <div className="space-y-1.5 text-[12px] text-slate-500 mb-4">
                <p className="flex items-start gap-1.5"><MapPin size={11} className="mt-0.5 flex-shrink-0"/>{b.address}</p>
                <p className="flex items-center gap-1.5"><Phone size={11}/>{b.phone}</p>
                <p>ผู้จัดการ: {b.manager}</p>
                <p>พนักงาน: {b.staff} คน</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-400">ยอดขายเดือนนี้</p>
                <p className="text-[18px] font-bold text-blue-600">{thb(b.revenue)} ฿</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
