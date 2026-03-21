"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Clock, Play, Square, DollarSign, Users, Calendar } from "lucide-react";
import clsx from "clsx";

interface Shift {
  id: string;
  employee: string;
  startTime: string;
  endTime: string | null;
  cashStart: number;
  cashEnd: number | null;
  sales: number;
  bills: number;
  status: "open" | "closed";
}

const DEMO_SHIFTS: Shift[] = [
  { id: "s1", employee: "ชนิ่น เกษมทรัพย์", startTime: "2026-03-21 08:00", endTime: null, cashStart: 1000, cashEnd: null, sales: 3250, bills: 12, status: "open" },
  { id: "s2", employee: "สมชาย ใจดี", startTime: "2026-03-20 08:00", endTime: "2026-03-20 17:00", cashStart: 1000, cashEnd: 4580, sales: 8420, bills: 28, status: "closed" },
  { id: "s3", employee: "สมหญิง รักงาน", startTime: "2026-03-20 12:00", endTime: "2026-03-20 21:00", cashStart: 500, cashEnd: 3200, sales: 6150, bills: 22, status: "closed" },
  { id: "s4", employee: "ชนิ่น เกษมทรัพย์", startTime: "2026-03-19 08:00", endTime: "2026-03-19 17:00", cashStart: 1000, cashEnd: 5120, sales: 9800, bills: 35, status: "closed" },
  { id: "s5", employee: "สมชาย ใจดี", startTime: "2026-03-19 12:00", endTime: "2026-03-19 21:00", cashStart: 500, cashEnd: 2800, sales: 5400, bills: 18, status: "closed" },
];

function thb(v: number) { return v.toLocaleString("th-TH", { minimumFractionDigits: 2 }); }
function fmtTime(s: string) {
  const d = new Date(s);
  return `${d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })} ${d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function ShiftPage() {
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const filtered = DEMO_SHIFTS.filter(s =>
    filter === "all" || s.status === filter
  );

  const openShifts = DEMO_SHIFTS.filter(s => s.status === "open");
  const totalSales = DEMO_SHIFTS.filter(s => s.status === "closed").reduce((sum, s) => sum + s.sales, 0);
  const totalBills = DEMO_SHIFTS.filter(s => s.status === "closed").reduce((sum, s) => sum + s.bills, 0);

  return (
    <PageShell>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">กะการขาย</h1>
          <button className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded" style={{ background: "#3c8dbc" }}>
            <Play size={14} /> เปิดกะการขาย
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3">
          <SummaryCard icon={Clock} color="#3c8dbc" label="กะที่เปิดอยู่" value={`${openShifts.length} กะ`} />
          <SummaryCard icon={DollarSign} color="#00a65a" label="ยอดขายรวม (ปิดแล้ว)" value={`${thb(totalSales)} ฿`} />
          <SummaryCard icon={Users} color="#f39c12" label="จำนวนบิลรวม" value={`${totalBills} บิล`} />
          <SummaryCard icon={Calendar} color="#605ca8" label="วันนี้" value={new Date().toLocaleDateString("th-TH")} />
        </div>

        {/* Filter tabs */}
        <div className="bg-white rounded shadow-sm">
          <div className="flex border-b border-slate-200">
            {([["all", "ทั้งหมด"], ["open", "กำลังเปิด"], ["closed", "ปิดแล้ว"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={clsx(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  filter === v ? "border-[#3c8dbc] text-[#3c8dbc]" : "border-transparent text-slate-500 hover:text-slate-700"
                )}>
                {l}
                {v === "open" && openShifts.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{openShifts.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Shift table */}
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px]">
                  <th className="text-left px-4 py-2.5 font-semibold">พนักงาน</th>
                  <th className="text-left px-4 py-2.5 font-semibold">เวลาเข้า</th>
                  <th className="text-left px-4 py-2.5 font-semibold">เวลาออก</th>
                  <th className="text-right px-4 py-2.5 font-semibold">เงินเปิดกะ</th>
                  <th className="text-right px-4 py-2.5 font-semibold">เงินปิดกะ</th>
                  <th className="text-right px-4 py-2.5 font-semibold">ยอดขาย</th>
                  <th className="text-right px-4 py-2.5 font-semibold">บิล</th>
                  <th className="text-center px-4 py-2.5 font-semibold">สถานะ</th>
                  <th className="text-center px-4 py-2.5 font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(shift => (
                  <tr key={shift.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: shift.status === "open" ? "#00a65a" : "#3c8dbc" }}>
                          {shift.employee.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{shift.employee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtTime(shift.startTime)}</td>
                    <td className="px-4 py-2.5 text-slate-600">{shift.endTime ? fmtTime(shift.endTime) : "-"}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{thb(shift.cashStart)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{shift.cashEnd != null ? thb(shift.cashEnd) : "-"}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-[#3c8dbc]">{thb(shift.sales)} ฿</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{shift.bills}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={clsx(
                        "text-[11px] font-medium px-2 py-0.5 rounded",
                        shift.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {shift.status === "open" ? "เปิดอยู่" : "ปิดแล้ว"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {shift.status === "open" ? (
                        <button className="flex items-center gap-1 mx-auto text-xs font-medium text-red-500 hover:text-red-600">
                          <Square size={11} /> ปิดกะ
                        </button>
                      ) : (
                        <button className="text-xs text-[#3c8dbc] hover:underline">ดูรายละเอียด</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Clock size={36} strokeWidth={1} />
                <p className="text-sm">ไม่มีข้อมูลกะการขาย</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function SummaryCard({ icon: Icon, color, label, value }: { icon: typeof Clock; color: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded shadow-sm flex items-center overflow-hidden">
      <div className="w-[60px] h-[60px] flex items-center justify-center flex-shrink-0" style={{ background: color }}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="px-3 py-2 min-w-0">
        <p className="text-[10px] text-slate-400 uppercase font-semibold">{label}</p>
        <p className="text-[14px] font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
