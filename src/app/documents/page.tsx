"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FileText, Download, Eye, Search, Plus } from "lucide-react";
import clsx from "clsx";

interface Doc {
  id: string; type: string; number: string; date: string;
  party: string; amount: number; status: string;
}

const DEMO: Doc[] = [
  { id:"d1",  type:"ใบเสร็จรับเงิน",   number:"R001234", date:"15/03/2026", party:"สมชาย ใจดี",   amount:175,   status:"issued"   },
  { id:"d2",  type:"ใบเสร็จรับเงิน",   number:"R001233", date:"15/03/2026", party:"-",             amount:70,    status:"issued"   },
  { id:"d3",  type:"ใบกำกับภาษี",      number:"T000045", date:"15/03/2026", party:"บจ.กรุงเทพเบเกอรี่",amount:340, status:"issued" },
  { id:"d4",  type:"ใบสั่งซื้อ",        number:"PO-0012", date:"14/03/2026", party:"บจ.เบเกอรี่ซัพพลาย",amount:2850,status:"approved"},
  { id:"d5",  type:"ใบรับสินค้า",       number:"GR-0009", date:"14/03/2026", party:"บจ.เบเกอรี่ซัพพลาย",amount:2850,status:"received"},
  { id:"d6",  type:"ใบสั่งซื้อ",        number:"PO-0011", date:"10/03/2026", party:"ร้านวัตถุดิบไทย",amount:1200, status:"approved"},
  { id:"d7",  type:"ใบกำกับภาษี",      number:"T000044", date:"10/03/2026", party:"ลูกค้าทั่วไป",  amount:890,   status:"issued"   },
  { id:"d8",  type:"ใบเสร็จรับเงิน",   number:"R001220", date:"09/03/2026", party:"วิชัย ทองดี",   amount:195,   status:"issued"   },
];

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  "ใบเสร็จรับเงิน": { color:"#10b981", bg:"#f0fdf4" },
  "ใบกำกับภาษี":   { color:"#3b82f6", bg:"#eff6ff" },
  "ใบสั่งซื้อ":     { color:"#8b5cf6", bg:"#f5f3ff" },
  "ใบรับสินค้า":   { color:"#f59e0b", bg:"#fffbeb" },
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  issued:   { label:"ออกแล้ว",  color:"#10b981", bg:"#f0fdf4" },
  approved: { label:"อนุมัติ",  color:"#3b82f6", bg:"#eff6ff" },
  received: { label:"รับแล้ว",  color:"#f59e0b", bg:"#fffbeb" },
  draft:    { label:"ร่าง",     color:"#94a3b8", bg:"#f8fafc" },
};

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const DOC_TYPES = ["ทั้งหมด","ใบเสร็จรับเงิน","ใบกำกับภาษี","ใบสั่งซื้อ","ใบรับสินค้า"];

export default function DocumentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ทั้งหมด");

  const filtered = DEMO.filter(d =>
    (typeFilter === "ทั้งหมด" || d.type === typeFilter) &&
    (search === "" || d.number.includes(search) || d.party.includes(search))
  );

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">เอกสาร</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> สร้างเอกสาร
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(TYPE_COLORS).map(([type, style]) => {
                const count = DEMO.filter(d => d.type === type).length;
                return (
                  <div key={type} className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderLeftColor: style.color }}>
                    <p className="text-[11px] text-slate-500 mb-1">{type}</p>
                    <p className="text-[22px] font-bold" style={{ color: style.color }}>{count}</p>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาเลขเอกสาร คู่ค้า..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-1 flex-wrap">
                {DOC_TYPES.map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={clsx("px-3 py-2 rounded-lg text-[12px] font-medium transition-colors",
                      typeFilter === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}>{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">เลขเอกสาร</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ประเภท</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">วันที่</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">คู่ค้า</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">มูลค่า</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(doc => {
                    const typeStyle = TYPE_COLORS[doc.type] ?? { color:"#64748b", bg:"#f8fafc" };
                    const statusStyle = STATUS_LABEL[doc.status] ?? STATUS_LABEL.draft;
                    return (
                      <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-blue-600 font-medium">{doc.number}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ color: typeStyle.color, background: typeStyle.bg }}>
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{doc.date}</td>
                        <td className="px-4 py-3 text-slate-700">{doc.party}</td>
                        <td className="px-4 py-3 text-right font-medium">{thb(doc.amount)} ฿</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color: statusStyle.color, background: statusStyle.bg }}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={13} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg"><Download size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <FileText size={40} strokeWidth={1} />
                  <p>ไม่พบเอกสาร</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
