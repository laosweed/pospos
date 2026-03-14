"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Search, Award, Gift } from "lucide-react";

const REWARDS = [
  { id:"r1", name:"ส่วนลด 20 บาท",        emoji:"🎫", points:100, stock:99 },
  { id:"r2", name:"ส่วนลด 50 บาท",        emoji:"🎫", points:200, stock:50 },
  { id:"r3", name:"กาแฟฟรี 1 แก้ว",       emoji:"☕", points:250, stock:30 },
  { id:"r4", name:"เค้กชิ้นฟรี",           emoji:"🎂", points:500, stock:15 },
  { id:"r5", name:"คูปองลด 100 บาท",       emoji:"💳", points:400, stock:40 },
  { id:"r6", name:"เบเกอรี่แพคคู่ฟรี",    emoji:"🧁", points:300, stock:25 },
];

const CUSTOMERS = [
  { id:"c1", name:"สมชาย ใจดี",   points:450 },
  { id:"c2", name:"นารี มีสุข",   points:280 },
  { id:"c3", name:"ประภา จันทร์", points:890 },
  { id:"c4", name:"อนุชา พรหมดี",points:1200 },
];

export default function PointsExchangePage() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof CUSTOMERS[0]|null>(null);
  const [success, setSuccess] = useState<string|null>(null);

  const filteredCustomers = CUSTOMERS.filter(c =>
    search==="" || c.name.includes(search)
  );

  const redeem = (reward: typeof REWARDS[0]) => {
    if (!selectedCustomer || selectedCustomer.points < reward.points) return;
    setSuccess(`แลก "${reward.name}" สำเร็จ! หักแต้ม ${reward.points} แต้ม`);
    setTimeout(()=>setSuccess(null), 3000);
  };

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">แลกแต้มสะสม</h1>

        <div className="flex gap-4">
          {/* Customer search */}
          <div className="w-64 flex-shrink-0 space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาลูกค้า..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"/>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredCustomers.map(c => (
                <button key={c.id} onClick={()=>setSelectedCustomer(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedCustomer?.id===c.id?"bg-blue-50":""}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-[11px] text-amber-500 flex items-center gap-1">
                      <Award size={10}/>{c.points.toLocaleString()} แต้ม
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="flex-1">
            {selectedCustomer && (
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">แต้มสะสมของ {selectedCustomer.name}</p>
                  <p className="text-white text-3xl font-bold">{selectedCustomer.points.toLocaleString()}</p>
                  <p className="text-amber-200 text-sm">แต้ม</p>
                </div>
                <Award size={48} className="text-white/30"/>
              </div>
            )}

            {success && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
                ✓ {success}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {REWARDS.map(reward => {
                const canRedeem = selectedCustomer && selectedCustomer.points >= reward.points;
                return (
                  <div key={reward.id} className={`bg-white rounded-2xl p-4 shadow-sm ${!canRedeem&&selectedCustomer?"opacity-50":""}`}>
                    <div className="text-3xl mb-2 text-center">{reward.emoji}</div>
                    <p className="text-sm font-semibold text-slate-800 text-center mb-1">{reward.name}</p>
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-3">
                      <Award size={12}/>
                      <span className="text-[13px] font-bold">{reward.points.toLocaleString()} แต้ม</span>
                    </div>
                    <button
                      onClick={() => redeem(reward)}
                      disabled={!canRedeem}
                      className="w-full py-2 rounded-xl bg-amber-500 text-white text-[13px] font-semibold hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Gift size={12} className="inline mr-1"/>แลก
                    </button>
                  </div>
                );
              })}
            </div>
            {!selectedCustomer && (
              <div className="flex flex-col items-center justify-center h-48 text-slate-300 gap-2">
                <Award size={48} strokeWidth={1}/>
                <p>เลือกลูกค้าก่อนแลกแต้ม</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
