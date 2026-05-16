"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Truck, Plus, MapPin, X, Phone } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";

type Order = { id: number; customer: string; address: string; phone: string; items: string; amount: number; status: "pending"|"delivering"|"delivered"|"cancelled"; date: string };
const INIT: Order[] = [
  { id:1, customer:"สมชาย ใจดี", address:"123 ถ.สุขุมวิท 21 กรุงเทพฯ", phone:"081-234-5678", items:"ครัวซองต์ x2, เค้ก x1", amount:270, status:"delivering", date:"2026-03-15" },
  { id:2, customer:"นารี มีสุข", address:"456 ถ.ลาดพร้าว กรุงเทพฯ", phone:"082-345-6789", items:"ชานมไข่มุก x3", amount:210, status:"pending", date:"2026-03-15" },
];
let nId=10;
function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits:2 }); }

export default function DeliveryPage() {
  const t = useTranslation();
  const SL = () => ({
    pending: t("delivery_pending"),
    delivering: t("delivery_delivering"),
    delivered: t("delivery_delivered"),
    cancelled: t("status_cancelled"),
  });
  const SC: Record<string,string> = { pending:"bg-amber-100 text-amber-600", delivering:"bg-blue-100 text-blue-600", delivered:"bg-emerald-100 text-emerald-600", cancelled:"bg-red-100 text-red-500" };

  const [so,setSo]=useState(true);
  const [orders,setOrders]=useState<Order[]>(INIT);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({customer:"",address:"",phone:"",items:"",amount:""});
  const save=()=>{ setOrders(p=>[...p,{id:nId++,...form,amount:parseFloat(form.amount)||0,status:"pending" as const,date:new Date().toISOString().split("T")[0]}]); setModal(false); };
  const next=(id:number)=>setOrders(p=>p.map(o=>o.id===id?{...o,status:o.status==="pending"?"delivering":o.status==="delivering"?"delivered":o.status}:o));
  const sl = SL();
  return (<>
    <Navbar onToggleSidebar={()=>setSo(v=>!v)}/>
    <div className="flex" style={{marginTop:50}}>
      {so&&<Sidebar/>}
      <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{marginLeft:so?200:0,background:"#edf1f5"}}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">{t("delivery_title")}</h1>
            <button onClick={()=>{setForm({customer:"",address:"",phone:"",items:"",amount:""});setModal(true);}} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"><Plus size={16}/>{t("delivery_create")}</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(["pending","delivering","delivered","cancelled"] as const).map(s=>(
              <div key={s} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-[12px] text-slate-500">{sl[s]}</p>
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
                    <span className={clsx("text-[11px] font-medium px-2 py-0.5 rounded-full",SC[o.status])}>{sl[o.status]}</span>
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
                      {o.status==="pending" ? t("delivery_accept") : t("delivery_complete")}
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
        <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-lg">{t("delivery_order_title")}</h2><button onClick={()=>setModal(false)} className="text-slate-400"><X size={20}/></button></div>
        <div className="space-y-3">
          {([["customer",t("col_customer")],["phone",t("label_phone")],["address",t("label_address")],["items",t("delivery_items_label")]] as [string,string][]).map(([k,l])=>(
            <div key={k}><label className="text-sm font-medium text-slate-700 block mb-1">{l}</label>
            <input value={(form as Record<string,string>)[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/></div>
          ))}
          <div><label className="text-sm font-medium text-slate-700 block mb-1">{t("delivery_total_label")}</label>
          <input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"/></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">{t("common_cancel")}</button>
          <button onClick={save} disabled={!form.customer} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">{t("delivery_create")}</button>
        </div>
      </div>
    </div>}
  </>);
}
