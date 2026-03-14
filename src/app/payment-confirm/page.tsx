"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { CheckCircle, XCircle, Clock, CreditCard, Smartphone, Banknote, RefreshCw } from "lucide-react";
import clsx from "clsx";

interface Payment {
  id: string; orderId: string; customer: string; amount: number;
  method: "cash" | "card" | "qr"; status: "success" | "failed" | "pending";
  time: string; ref: string;
}

const DEMO: Payment[] = [
  { id:"p1", orderId:"#0042", customer:"สมชาย ใจดี",    amount:320,  method:"qr",   status:"success", time:"10:32", ref:"QR20260315001" },
  { id:"p2", orderId:"#0041", customer:"นารี มีสุข",    amount:185,  method:"card",  status:"success", time:"10:18", ref:"CARD4411" },
  { id:"p3", orderId:"#0040", customer:"วิชัย ทองดี",   amount:540,  method:"qr",   status:"failed",  time:"10:05", ref:"QR20260315002" },
  { id:"p4", orderId:"#0039", customer:"ประภา จันทร์",  amount:95,   method:"cash",  status:"success", time:"09:55", ref:"CASH039" },
  { id:"p5", orderId:"#0038", customer:"มานะ สุขใส",    amount:760,  method:"card",  status:"pending", time:"09:40", ref:"CARD8821" },
  { id:"p6", orderId:"#0037", customer:"กัลยา รักดี",   amount:230,  method:"qr",   status:"success", time:"09:22", ref:"QR20260315003" },
];

const METHOD_LABELS = { cash: "เงินสด", card: "บัตร", qr: "QR/PromptPay" };
const METHOD_ICONS = { cash: Banknote, card: CreditCard, qr: Smartphone };

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }

export default function PaymentConfirmPage() {
  const [filter, setFilter] = useState<"all"|"success"|"failed"|"pending">("all");
  const [selected, setSelected] = useState<Payment|null>(null);

  const payments = filter === "all" ? DEMO : DEMO.filter(p => p.status === filter);
  const totalSuccess = DEMO.filter(p => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const totalFailed = DEMO.filter(p => p.status === "failed").length;
  const totalPending = DEMO.filter(p => p.status === "pending").length;

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">ยืนยันการชำระเงิน</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">ชำระสำเร็จวันนี้</p>
            <p className="text-[20px] font-bold text-emerald-600">{thb(totalSuccess)} ฿</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">รอยืนยัน</p>
            <p className="text-[20px] font-bold text-amber-500">{totalPending} รายการ</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[12px] text-slate-500 mb-1">ล้มเหลว</p>
            <p className="text-[20px] font-bold text-red-500">{totalFailed} รายการ</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all","success","pending","failed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={clsx("px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors",
                filter===f ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm")}>
              {f==="all"?"ทั้งหมด":f==="success"?"สำเร็จ":f==="pending"?"รอยืนยัน":"ล้มเหลว"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-slate-500 font-medium">ออเดอร์</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">ลูกค้า</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">ช่องทาง</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">ยอด</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">สถานะ</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">เวลา</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const Icon = METHOD_ICONS[p.method];
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{p.orderId}</td>
                    <td className="px-4 py-3 text-slate-700">{p.customer}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Icon size={13} />
                        <span className="text-[12px]">{METHOD_LABELS[p.method]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{thb(p.amount)} ฿</td>
                    <td className="px-4 py-3 text-center">
                      {p.status === "success" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> สำเร็จ
                        </span>
                      )}
                      {p.status === "failed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                          <XCircle size={10} /> ล้มเหลว
                        </span>
                      )}
                      {p.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                          <Clock size={10} /> รอยืนยัน
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[12px]">{p.time}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(p)}
                        className="text-[12px] text-blue-600 hover:underline">รายละเอียด</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[380px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-800">รายละเอียดการชำระ</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="flex justify-center mb-5">
              {selected.status === "success" && <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle size={32} className="text-emerald-500" /></div>}
              {selected.status === "failed" && <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"><XCircle size={32} className="text-red-500" /></div>}
              {selected.status === "pending" && <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center"><Clock size={32} className="text-amber-500" /></div>}
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["ออเดอร์", selected.orderId],
                ["ลูกค้า", selected.customer],
                ["ช่องทาง", METHOD_LABELS[selected.method]],
                ["ยอดชำระ", `${thb(selected.amount)} ฿`],
                ["เลขอ้างอิง", selected.ref],
                ["เวลา", selected.time],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-800">{v}</span>
                </div>
              ))}
            </div>
            {selected.status === "failed" && (
              <button className="mt-5 w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                <RefreshCw size={14} /> ลองใหม่อีกครั้ง
              </button>
            )}
            {selected.status === "pending" && (
              <button className="mt-5 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 flex items-center justify-center gap-2">
                <CheckCircle size={14} /> ยืนยันการชำระ
              </button>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
