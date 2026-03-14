"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Truck, Plus, MapPin, Phone, Clock } from "lucide-react";
import clsx from "clsx";

type DeliveryStatus = "pending"|"preparing"|"delivering"|"delivered"|"cancelled";

interface Delivery {
  id:string; orderNo:string; customer:string; phone:string; address:string;
  items:string[]; total:number; fee:number; status:DeliveryStatus;
  platform:string; estimatedTime:string; driver?:string;
}

const DEMO: Delivery[] = [
  { id:"d1", orderNo:"DEL-0045", customer:"สมชาย ใจดี",   phone:"081-234-5678", address:"123 ซ.สุขุมวิท 11 กรุงเทพ", items:["ครัวซองต์×2","กาแฟ×1"], total:155, fee:30, status:"delivering", platform:"Grab",     estimatedTime:"14:45", driver:"คมกฤช" },
  { id:"d2", orderNo:"DEL-0044", customer:"นารี มีสุข",   phone:"082-345-6789", address:"456 ถ.สีลม แขวงสีลม",       items:["ชีสเค้ก×1","ชานมไข่มุก×2"],total:300,fee:40,status:"preparing", platform:"Foodpanda", estimatedTime:"15:00" },
  { id:"d3", orderNo:"DEL-0043", customer:"วิชัย ทองดี",  phone:"083-456-7890", address:"789 ถ.อโศก แขวงวัฒนา",      items:["เค้กช็อกโกแลต×1"],          total:180, fee:50, status:"pending",   platform:"LINE MAN",  estimatedTime:"15:15" },
  { id:"d4", orderNo:"DEL-0042", customer:"ประภา จันทร์", phone:"084-567-8901", address:"111 ซ.ลาดพร้าว 15",         items:["กาแฟ×3","มัฟฟิน×2"],         total:305, fee:35, status:"delivered", platform:"Grab",     estimatedTime:"13:30", driver:"ชาญชัย" },
];

const STATUS: Record<DeliveryStatus,{label:string;color:string;bg:string}> = {
  pending:    { label:"รอดำเนินการ", color:"#94a3b8", bg:"#f8fafc" },
  preparing:  { label:"กำลังเตรียม", color:"#f59e0b", bg:"#fffbeb" },
  delivering: { label:"กำลังส่ง",    color:"#3b82f6", bg:"#eff6ff" },
  delivered:  { label:"ส่งแล้ว",     color:"#10b981", bg:"#f0fdf4" },
  cancelled:  { label:"ยกเลิก",      color:"#ef4444", bg:"#fef2f2" },
};

const PLATFORMS: Record<string,string> = { Grab:"#00B14F", Foodpanda:"#d70f64", "LINE MAN":"#06c755" };

function thb(v: number) { return v.toLocaleString("th-TH"); }

export default function DeliveryPage() {
  const [filter, setFilter] = useState<DeliveryStatus|"all">("all");

  const filtered = DEMO.filter(d => filter==="all" || d.status===filter);
  const active = DEMO.filter(d=>d.status==="delivering"||d.status==="preparing"||d.status==="pending").length;

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">เดลิเวอรี่</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={15}/> สร้างออเดอร์
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {Object.entries(STATUS).map(([key,st]) => {
            const count = DEMO.filter(d=>d.status===key).length;
            return (
              <div key={key} className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-[11px] text-slate-400">{st.label}</p>
                <p className="text-[20px] font-bold" style={{ color:st.color }}>{count}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-1 flex-wrap">
          {[["all","ทั้งหมด"],...Object.entries(STATUS).map(([k,v])=>[k,v.label])].map(([k,l]) => (
            <button key={k} onClick={()=>setFilter(k as DeliveryStatus|"all")}
              className={clsx("px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors",
                filter===k?"bg-blue-600 text-white":"bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
              )}>{l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(d => {
            const st = STATUS[d.status];
            const platColor = PLATFORMS[d.platform] ?? "#64748b";
            return (
              <div key={d.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                      style={{ background:platColor }}>
                      {d.platform.slice(0,2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{d.orderNo}</p>
                      <p className="text-[12px] text-slate-400">{d.platform}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color:st.color, background:st.bg }}>
                    {st.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-500 mb-3">
                  <p className="flex items-center gap-1"><Phone size={11}/>{d.customer} · {d.phone}</p>
                  <p className="flex items-center gap-1"><Clock size={11}/>ETA: {d.estimatedTime}</p>
                  <p className="flex items-start gap-1 col-span-2"><MapPin size={11} className="mt-0.5 flex-shrink-0"/>{d.address}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {d.items.map((item,i)=>(
                      <span key={i} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{item}</span>
                    ))}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800">{thb(d.total)} ฿</p>
                    <p className="text-[11px] text-slate-400">+{d.fee} ฿ ค่าส่ง</p>
                  </div>
                </div>
                {d.driver && <p className="text-[11px] text-blue-500 mt-2 flex items-center gap-1"><Truck size={11}/>ไรเดอร์: {d.driver}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
