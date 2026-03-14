"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { ArrowRight, Plus, CheckCircle } from "lucide-react";
import clsx from "clsx";

const BRANCHES = ["สาขาสุขุมวิท (หลัก)", "สาขาสีลม", "สาขาอโศก"];
const PRODUCTS = [
  { id:"p1", name:"ครัวซองต์เนย", emoji:"🥐", stock:20 },
  { id:"p2", name:"กาแฟลาเต้",    emoji:"☕", stock:50 },
  { id:"p3", name:"ชีสเค้ก",      emoji:"🍰", stock:6  },
  { id:"p4", name:"โดนัทกลาเซ่",  emoji:"🍩", stock:18 },
];

interface Transfer { id:string; date:string; from:string; to:string; items:{name:string;emoji:string;qty:number}[]; status:string }

const HISTORY: Transfer[] = [
  { id:"t1", date:"14/03/2026", from:"สาขาสุขุมวิท (หลัก)", to:"สาขาสีลม",  items:[{name:"ครัวซองต์เนย",emoji:"🥐",qty:5},{name:"กาแฟลาเต้",emoji:"☕",qty:10}], status:"completed" },
  { id:"t2", date:"12/03/2026", from:"สาขาอโศก",            to:"สาขาสีลม",  items:[{name:"ชีสเค้ก",emoji:"🍰",qty:3}], status:"completed" },
];

export default function TransferPage() {
  const [from, setFrom] = useState(BRANCHES[0]);
  const [to, setTo] = useState(BRANCHES[1]);
  const [items, setItems] = useState<{id:string;name:string;emoji:string;qty:number}[]>([]);
  const [done, setDone] = useState(false);

  const addItem = (p: typeof PRODUCTS[0]) => {
    if (items.find(i=>i.id===p.id)) return;
    setItems(prev => [...prev, {...p, qty:1}]);
  };
  const updateQty = (id:string, qty:number) => setItems(prev => prev.map(i=>i.id===id?{...i,qty}:i).filter(i=>i.qty>0));

  const submit = () => { setDone(true); setTimeout(()=>{setDone(false);setItems([]);},2000); };

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">โอนสินค้าระหว่างสาขา</h1>

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">จากสาขา</label>
              <select value={from} onChange={e=>setFrom(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                {BRANCHES.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <ArrowRight size={24} className="text-slate-400 flex-shrink-0 mt-5" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">ไปสาขา</label>
              <select value={to} onChange={e=>setTo(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                {BRANCHES.filter(b=>b!==from).map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">เลือกสินค้า</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={()=>addItem(p)}
                  className={clsx("bg-slate-50 rounded-xl p-3 text-center text-sm hover:bg-blue-50 border-2 transition-all",
                    items.find(i=>i.id===p.id)?"border-blue-400":"border-transparent"
                  )}>
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <div className="font-medium text-slate-700 text-[12px]">{p.name}</div>
                  <div className="text-[11px] text-slate-400">คงเหลือ {p.stock}</div>
                </button>
              ))}
            </div>

            {items.length > 0 && (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-blue-50 rounded-xl px-3 py-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    <input type="number" min={1} value={item.qty} onChange={e=>updateQty(item.id,parseInt(e.target.value)||0)}
                      className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none" />
                    <span className="text-xs text-slate-400">ชิ้น</span>
                    <button onClick={()=>updateQty(item.id,0)} className="text-slate-400 hover:text-red-400">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={submit} disabled={items.length===0||from===to}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2">
            {done ? <><CheckCircle size={16}/>โอนสำเร็จ!</> : "ยืนยันการโอน"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b font-semibold text-slate-700">ประวัติการโอน</div>
          {HISTORY.map(h => (
            <div key={h.id} className="px-5 py-3 border-b border-slate-50 hover:bg-slate-50">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="font-medium text-slate-800">{h.from}</span>
                <ArrowRight size={12} className="text-slate-400" />
                <span className="font-medium text-slate-800">{h.to}</span>
                <span className="ml-auto text-slate-400">{h.date}</span>
              </div>
              <div className="flex gap-2">
                {h.items.map((item,i) => (
                  <span key={i} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{item.emoji} {item.name} ×{item.qty}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
