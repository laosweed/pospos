"use client";

import PageShell from "@/components/PageShell";
import { Smartphone, Monitor, Tablet, LogOut } from "lucide-react";
import clsx from "clsx";

const DEVICES = [
  { id:"d1", name:"iPad Pro (POS #1)",    type:"tablet",  browser:"Safari 17", os:"iPadOS 17", ip:"192.168.1.10", location:"สาขาสุขุมวิท", lastActive:"ออนไลน์อยู่",         current:true  },
  { id:"d2", name:"iPhone 15 Pro",         type:"mobile",  browser:"Safari 17", os:"iOS 17",   ip:"192.168.1.20", location:"สาขาสุขุมวิท", lastActive:"เมื่อ 5 นาทีที่แล้ว", current:false },
  { id:"d3", name:"MacBook Pro",           type:"desktop", browser:"Chrome 122",os:"macOS 14", ip:"192.168.1.30", location:"ออฟฟิศ",         lastActive:"เมื่อ 2 ชั่วโมง",     current:false },
  { id:"d4", name:"Samsung Galaxy Tab A9", type:"tablet",  browser:"Chrome 122",os:"Android 13",ip:"192.168.1.40",location:"สาขาสีลม",     lastActive:"เมื่อวาน 18:30",        current:false },
  { id:"d5", name:"iPhone 13",             type:"mobile",  browser:"Safari 16", os:"iOS 16",   ip:"172.16.0.5",   location:"ไม่ทราบ",        lastActive:"3 วันที่แล้ว",          current:false },
];

const ICONS = { tablet:<Tablet size={20}/>, mobile:<Smartphone size={20}/>, desktop:<Monitor size={20}/> };

export default function DevicesPage() {
  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">อุปกรณ์ที่เข้าสู่ระบบ</h1>

        <div className="space-y-3">
          {DEVICES.map(d => (
            <div key={d.id} className={clsx("bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4", d.current && "border-2 border-blue-200")}>
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                d.current ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
              )}>
                {ICONS[d.type as keyof typeof ICONS]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">{d.name}</p>
                  {d.current && <span className="text-[11px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">อุปกรณ์นี้</span>}
                </div>
                <p className="text-[12px] text-slate-500">{d.browser} · {d.os}</p>
                <p className="text-[12px] text-slate-400">{d.ip} · {d.location} · {d.lastActive}</p>
              </div>
              {!d.current && (
                <button className="flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                  <LogOut size={13}/> ออกจากระบบ
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors text-sm">
          ออกจากระบบอุปกรณ์ทั้งหมด (ยกเว้นอุปกรณ์นี้)
        </button>
      </div>
    </PageShell>
  );
}
