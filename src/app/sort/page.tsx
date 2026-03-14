"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { GripVertical, Save } from "lucide-react";

interface MenuItem { id:string; name:string; emoji:string; category:string; order:number; active:boolean }

const INITIAL: MenuItem[] = [
  { id:"p1", name:"ครัวซองต์เนย",    emoji:"🥐", category:"เบเกอรี่",    order:1,  active:true },
  { id:"p2", name:"ขนมปังโฮลวีท",    emoji:"🍞", category:"เบเกอรี่",    order:2,  active:true },
  { id:"p3", name:"มัฟฟินบลูเบอร์รี่",emoji:"🧁", category:"เบเกอรี่",    order:3,  active:true },
  { id:"p4", name:"กาแฟลาเต้",       emoji:"☕", category:"เครื่องดื่ม",  order:4,  active:true },
  { id:"p5", name:"ชานมไข่มุก",      emoji:"🧋", category:"เครื่องดื่ม",  order:5,  active:true },
  { id:"p6", name:"เค้กช็อกโกแลต",   emoji:"🎂", category:"เค้ก",         order:6,  active:true },
  { id:"p7", name:"ชีสเค้ก",         emoji:"🍰", category:"เค้ก",         order:7,  active:true },
  { id:"p8", name:"โดนัทกลาเซ่",     emoji:"🍩", category:"โดนัท",        order:8,  active:true },
];

export default function SortPage() {
  const [items, setItems] = useState(INITIAL);
  const [dragging, setDragging] = useState<string|null>(null);
  const [saved, setSaved] = useState(false);

  const moveUp   = (id: string) => setItems(prev => {
    const i = prev.findIndex(p=>p.id===id);
    if (i<=0) return prev;
    const arr = [...prev];
    [arr[i-1],arr[i]] = [arr[i],arr[i-1]];
    return arr.map((p,idx)=>({...p,order:idx+1}));
  });
  const moveDown = (id: string) => setItems(prev => {
    const i = prev.findIndex(p=>p.id===id);
    if (i>=prev.length-1) return prev;
    const arr = [...prev];
    [arr[i],arr[i+1]] = [arr[i+1],arr[i]];
    return arr.map((p,idx)=>({...p,order:idx+1}));
  });
  const toggleActive = (id: string) => setItems(prev => prev.map(p=>p.id===id?{...p,active:!p.active}:p));

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">เรียงลำดับสินค้า / เมนู</h1>
          <button onClick={save} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            <Save size={15}/>{saved?"✓ บันทึกแล้ว":"บันทึกลำดับ"}
          </button>
        </div>

        <p className="text-sm text-slate-500">ลำดับสินค้าจะแสดงในหน้าขาย กดปุ่มลูกศรเพื่อเปลี่ยนลำดับ</p>

        <div className="space-y-2">
          {items.map((item,i) => (
            <div key={item.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
              <GripVertical size={16} className="text-slate-300 flex-shrink-0 cursor-grab"/>
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[12px] font-bold flex items-center justify-center flex-shrink-0">
                {item.order}
              </span>
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-[11px] text-slate-400">{item.category}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>moveUp(item.id)} disabled={i===0}
                  className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-[14px]">
                  ↑
                </button>
                <button onClick={()=>moveDown(item.id)} disabled={i===items.length-1}
                  className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-[14px]">
                  ↓
                </button>
              </div>
              <button onClick={()=>toggleActive(item.id)}
                className={`w-10 h-6 rounded-full relative transition-colors ${item.active?"bg-blue-500":"bg-slate-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.active?"left-4":"left-0.5"}`}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
