"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Truck, Plus, MapPin, X, Phone } from "lucide-react";
import clsx from "clsx";
type Order = { id: number; customer: string; address: string; phone: string; items: string; amount: number; status: "pending"|"delivering"|"delivered"|"cancelled"; date: string };
const INIT: Order[] = [
  { id:1, customer:"สมชาย ใจดี", address:"123 ถ.สุขุมวิท 21 กรุงเทพฯ", phone:"081-234-5678", items:"ครัวซองต์ x2, เค้ก x1", amount:270, status:"delivering", date:"2026-03-15" },
  { id:2, customer:"นารี มีสุข", address:"456 ถ.ลาดพร้าว กรุงเทพฯ", phone:"082-345-6789", items:"ชานมไข่มุก x3", amount:210, status:"pending", date:"2026-03-15" },
];
let nId=10;
const SL: Record<string,string> = { pending:"รอรับ", delivering:"กำลังส่ง", delivered:"ส่งแล้ว", cancelled:"ยกเลิก" };
const SC: Record<string,string> = { pending:"bg-amber-100 text-amber-600", delivering:"bg-blue-100 text-blue-600", delivered:"bg-emerald-100 text-emerald-600", cancelled:"bg-red-100 text-red-500" };
function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits:2 }); }
export default function DeliveryPage() {
  const [so,setSo]=useState(true);
  const [orders,setOrders]=useState<Order[]>(INIT);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({customer:"",address:"",phone:"",items:"",amount:""});
  const save=()=>{ setOrders(p=>[...p,{id:nId++,...form,amount:parseFloat(form.amount)||0,status:"pending",date:new Date().toISOString().split("T")[0]}]); setModal(false); };
  const next=(id:number)=>setOrders(p=>p.map(o=>o.id===id?{...o,status:o.status==="pending"?"delivering":o.status==="delivering"?"delivered":o.status}:o));
  return (<>
    <Navbar onToggleSidebar={()=>setSo(v=>!v)}/>
    <div className="flex" style={{marginTop:50}}>
      {so&&<Sidebar/>}
      <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{marginLeft:so?230:0,background:"#edf1f5"}}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">จัดส่งสินค้า</h1>
            <button onClick={()=>{setForm({customer:"",address:"",phone:"",items:"",amount:""});setModal(true);}} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"><Plus size={16}/>สร้างออเดอร์</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["pending","delivering","delivered","cancelled"].map(s=>(
              <div key={s} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-[12px] text-slate-500">{SL[s]}</p>
                <p className="text-xl font-bold text-slate-700">{orders.filter(o=>o.status===s).length}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {orders.map(o=>(
              <div key={o.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0"><Truck size={18} className="text-blue-500"/></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{o.customer}</span>
                    <span className={clsx("text-[11px] font-medium px-2 py-0.5 rounded-full",SC[o.status])}>{SL[o.status]}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={11}/>{o.address}</span>
                    <span className="flex items-center gap-1"><Phone size={11}/>{o.phone}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-1">{o.items}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-700">{thb(o.amount)} ฿</p>
                  {(o.status==="pending"||o.status==="delivering") && (
                    <button onClick={()=>next(o.id)} className="mt-1 text-[11px] px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                      {o.status==="pending"?"รับออเดอร์":"ส่งสำเร็จ"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    {modal&&<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={()=>setModal(false)}>
      <div className="bg-white rounded-2xl p-6 w-[440px] shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-lg">สร้างออเดอร์จัดส่ง</h2><button onClick={()=>setModal(false)} className="text-slate-400"><X size={20}/></button></div>
        <div className="space-y-3">
          {[["customer","ชื่อลูกค้า"],["phone","เบอร์โทร"],["address","ที่อยู่จัดส่ง"],["items","รายการสินค้า"]].map(([k,l])=>(
            <div key={k}><label className="text-sm font-medium text-slate-700 block mb-1">{l}</label>
            <input value={(form as Record<string,string>)[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/></div>
          ))}
          <div><label className="text-sm font-medium text-slate-700 block mb-1">ยอดรวม (฿)</label>
          <input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">ยกเลิก</button>
          <button onClick={save} disabled={!form.customer} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">สร้าง</button>
        </div>
      </div>
    </div>}
  </>);
}
