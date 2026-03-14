"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Edit2, Phone, Mail, Building2, X } from "lucide-react";

interface Vendor {
  id: string; name: string; contact: string; phone: string; email: string;
  address: string; category: string; totalOrders: number; totalAmount: number;
}

const DEMO: Vendor[] = [
  { id:"v1", name:"บจ.เบเกอรี่ซัพพลาย",      contact:"คุณสมชาย",   phone:"02-123-4567", email:"order@bakerysupply.co.th", address:"123 ถ.สุขุมวิท กรุงเทพ", category:"วัตถุดิบ",   totalOrders:24, totalAmount:68000 },
  { id:"v2", name:"ร้านวัตถุดิบไทย",           contact:"คุณนารี",    phone:"02-234-5678", email:"info@rawmatth.com",          address:"456 ถ.พระราม 4 กรุงเทพ", category:"วัตถุดิบ",   totalOrders:18, totalAmount:42000 },
  { id:"v3", name:"บจ.นมสดและผลิตภัณฑ์",       contact:"คุณประภา",   phone:"02-345-6789", email:"dairy@milkco.th",            address:"789 ถ.รัชดา กรุงเทพ",    category:"นม/ครีม",    totalOrders:36, totalAmount:89000 },
  { id:"v4", name:"ฟาร์มไก่ไทยเนเจอรัล",       contact:"คุณวิชัย",   phone:"02-456-7890", email:"farm@thaiegg.com",           address:"กม.30 ถ.พหลโยธิน",       category:"ไข่/นม",     totalOrders:52, totalAmount:52000 },
  { id:"v5", name:"บจ.บรรจุภัณฑ์เบเกอรี่",      contact:"คุณมาลี",    phone:"02-567-8901", email:"box@packbakery.com",         address:"555 ถ.ลาดพร้าว กรุงเทพ", category:"บรรจุภัณฑ์", totalOrders:12, totalAmount:18000 },
];

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

export default function VendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState<Vendor | null>(null);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} storeName="ร้านเบเกอรี่ (ตัวอย่าง)" employeeName="ชนิ่น เกษมทรัพย์" />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 230 : 0, background: "#edf1f5" }}>
          <div className="p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">ผู้ผลิต / ซัพพลายเออร์</h1>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={15} /> เพิ่มผู้ผลิต
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ผู้ผลิตทั้งหมด</p>
                <p className="text-[22px] font-bold text-blue-600">{DEMO.length} ราย</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">ยอดสั่งซื้อรวม</p>
                <p className="text-[22px] font-bold text-purple-600">{thb(DEMO.reduce((s,v)=>s+v.totalOrders,0))} ครั้ง</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[12px] text-slate-500 mb-1">มูลค่ารวม</p>
                <p className="text-[22px] font-bold text-emerald-600">{thb(DEMO.reduce((s,v)=>s+v.totalAmount,0))} ฿</p>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {DEMO.map(vendor => (
                <div key={vendor.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <button onClick={() => setSelected(vendor)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg">
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{vendor.name}</h3>
                  <span className="inline-block bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full mb-3">{vendor.category}</span>
                  <div className="space-y-1.5 text-sm text-slate-500">
                    <p className="flex items-center gap-1.5"><Phone size={12} />{vendor.phone}</p>
                    <p className="flex items-center gap-1.5"><Mail size={12} />{vendor.email}</p>
                    <p className="text-[12px]">{vendor.address}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                    <div>
                      <p className="text-[11px] text-slate-400">สั่งซื้อ</p>
                      <p className="font-bold text-slate-700">{vendor.totalOrders} ครั้ง</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">ยอดรวม</p>
                      <p className="font-bold text-blue-600">{thb(vendor.totalAmount)} ฿</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-[380px] h-full overflow-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">แก้ไขผู้ผลิต</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[["ชื่อบริษัท/ร้านค้า",selected.name],["ชื่อผู้ติดต่อ",selected.contact],["เบอร์โทร",selected.phone],["อีเมล",selected.email],["ที่อยู่",selected.address]].map(([l,v]) => (
                <div key={l}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{l}</label>
                  <input defaultValue={v} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
