"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Download, BarChart2, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import clsx from "clsx";
import type { Store, Employee, DailySalesSummary } from "@/lib/supabase/types";

export interface HourlyPoint { hour: string; today: number; yesterday: number }

interface DashboardStatsProps {
  store: Store;
  employees: Employee[];
  todaySummary: DailySalesSummary | null;
  yesterdaySummary: DailySalesSummary | null;
  hourlyData: HourlyPoint[];
}

type ViewMode   = "sell" | "buy";
type ChartMode  = "bar" | "line";

function thb(val: number) {
  return val.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function growthPct(today: number, yesterday: number): string {
  if (yesterday === 0) return today === 0 ? "0%" : "+100%";
  const pct = ((today - yesterday) / yesterday) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

export default function DashboardStats({
  store,
  employees,
  todaySummary,
  yesterdaySummary,
  hourlyData,
}: DashboardStatsProps) {
  const [viewMode,       setViewMode]       = useState<ViewMode>("sell");
  const [chartMode,      setChartMode]      = useState<ChartMode>("line");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [periodOpen,     setPeriodOpen]     = useState(false);

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

  // today
  const totalToday      = todaySummary?.total_revenue   ?? 0;
  const billsToday      = todaySummary?.total_bills     ?? 0;
  const cancelledToday  = todaySummary?.cancelled_bills ?? 0;
  const avgToday        = billsToday > 0 ? totalToday / billsToday : 0;

  // yesterday
  const totalYest     = yesterdaySummary?.total_revenue   ?? 0;
  const billsYest     = yesterdaySummary?.total_bills     ?? 0;
  const cancelledYest = yesterdaySummary?.cancelled_bills ?? 0;
  const avgYest       = billsYest > 0 ? totalYest / billsYest : 0;

  const growth = growthPct(totalToday, totalYest);
  const hasData = hourlyData.some(d => d.today > 0 || d.yesterday > 0);

  return (
    <div className="mx-4 my-3 rounded-xl p-4" style={{ background: "#bfdbfe" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[15px] font-semibold text-blue-950">
          ยอดขายวันนี้ {dateStr}
        </h2>
        <div className="flex gap-1.5">
          <ModeBtn active={viewMode === "sell"} onClick={() => setViewMode("sell")}>ขาย</ModeBtn>
          <ModeBtn active={viewMode === "buy"}  onClick={() => setViewMode("buy")}>รับซื้อ</ModeBtn>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-2.5 mb-3.5">
        <FilterSelect
          value={store.id}
          options={[{ value: store.id, label: `🏪 ${store.name}` }]}
          onChange={() => {}}
        />
        <FilterSelect
          value={selectedEmployee}
          options={[
            { value: "all", label: "👥 พนักงานทั้งหมด" },
            ...employees.map(e => ({ value: e.id, label: `👤 ${e.name}` })),
          ]}
          onChange={setSelectedEmployee}
        />
      </div>

      {/* ── Stats Card ── */}
      <div className="bg-white rounded-xl p-4 shadow-sm">

        {/* Card header: period button + currency */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="relative">
            <button
              onClick={() => setPeriodOpen(v => !v)}
              className="flex items-center gap-2 bg-slate-800 text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-lg"
            >
              <span className="text-[10px]">⬛</span> เมื่อวาน
            </button>
            {/* Period picker dropdown */}
            {periodOpen && (
              <div className="absolute left-0 top-10 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 min-w-36">
                {["วันนี้","เมื่อวาน","สัปดาห์นี้","เดือนนี้","ปีนี้","กำหนดเอง"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriodOpen(false)}
                    className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 bg-slate-800 text-white text-[12px] px-3.5 py-1.5 rounded-full">
            <span className="text-yellow-400 font-bold text-[13px]">฿</span>
            Thai Baht ›
          </button>
        </div>

        {/* ── Metrics row ── */}
        <div className="flex items-stretch gap-0 mb-4">

          {/* Total revenue */}
          <div className="pr-6 min-w-0">
            <p className="text-[12px] text-slate-500 mb-1">ยอดรวม</p>
            <p className="text-[26px] font-bold text-sky-500 leading-none">{thb(totalToday)} ฿</p>
            {totalYest > 0 && (
              <p className="text-[12px] text-slate-400 mt-1">{thb(totalYest)} ฿</p>
            )}
          </div>

          {/* Growth */}
          <div className="px-6 min-w-0">
            <p className="text-[12px] text-slate-500 mb-1">การเติบโต</p>
            <p className={clsx(
              "text-[26px] font-bold leading-none",
              totalToday > totalYest ? "text-emerald-500" : totalToday < totalYest ? "text-red-500" : "text-emerald-500"
            )}>
              {growth}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">(จากเมื่อวาน)</p>
          </div>

          {/* Grid stats */}
          <div className="flex-1 border border-slate-200 rounded-xl grid grid-cols-3 min-w-0">
            <GridStat
              label="บิลยกเลิก"
              value={cancelledToday}
              subValue={cancelledYest}
              href="/sale-history?status=cancelled"
            />
            <GridStat
              label="บิลขาย"
              value={billsToday}
              subValue={billsYest}
              bordered
              href="/sale-history"
            />
            <GridStat
              label="เฉลี่ย/บิล"
              value={`${thb(avgToday)} ฿`}
              subValue={avgYest > 0 ? `${thb(avgYest)} ฿` : undefined}
            />
          </div>
        </div>

        {/* Chart toolbar */}
        <div className="flex items-center gap-2 mb-3">
          <button className="flex items-center gap-2 text-sky-500 text-[13px] font-medium flex-1 hover:text-sky-600 transition-colors">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white flex-shrink-0">
              <Clock size={11} />
            </span>
            ช่วงเวลา (24 ชั่วโมง) ›
          </button>
          <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-colors">
            <Download size={12} /> ดาวน์โหลดกราฟ
          </button>
          <button
            onClick={() => setChartMode("bar")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-lg border transition-colors",
              chartMode === "bar"
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <BarChart2 size={14} />
          </button>
          <button
            onClick={() => setChartMode("line")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-lg border transition-colors",
              chartMode === "line"
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <TrendingUp size={14} />
          </button>
        </div>

        {/* Chart */}
        {hasData ? (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "bar" ? (
                <BarChart data={hourlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      `${thb(v)} ฿`,
                      name === "today" ? "วันนี้" : "เมื่อวาน",
                    ]}
                    contentStyle={{ fontFamily: "Sarabun, sans-serif", fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend
                    formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v === "today" ? "วันนี้" : "เมื่อวาน"}</span>}
                  />
                  <Bar dataKey="yesterday" fill="#cbd5e1" radius={[3,3,0,0]} name="yesterday" />
                  <Bar dataKey="today"     fill="#0ea5e9" radius={[3,3,0,0]} name="today" />
                </BarChart>
              ) : (
                <LineChart data={hourlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => `${thb(v)} ฿`} width={70} />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      `${thb(v)} ฿`,
                      name === "today" ? "วันนี้" : "เมื่อวาน",
                    ]}
                    contentStyle={{ fontFamily: "Sarabun, sans-serif", fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend
                    formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v === "today" ? "วันนี้" : "เมื่อวาน"}</span>}
                  />
                  <Line
                    type="monotone" dataKey="yesterday"
                    stroke="#cbd5e1" strokeWidth={2} dot={{ r: 2 }}
                    name="yesterday"
                  />
                  <Line
                    type="monotone" dataKey="today"
                    stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 2.5 }}
                    name="today"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <BarChart2 size={52} strokeWidth={1} className="text-slate-200" />
            <span className="text-[14px] text-slate-400">ไม่มีข้อมูล</span>
          </div>
        )}
      </div>

      {/* More data button */}
      <Link
        href="/reports"
        className="flex items-center gap-2 mx-auto mt-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-7 py-2.5 rounded-full transition-colors w-fit"
      >
        <BarChart2 size={15} /> ข้อมูลเพิ่มเติม
      </Link>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────

function ModeBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
        active ? "bg-slate-800 text-white" : "bg-white/60 text-slate-600 hover:bg-white/90"
      )}
    >
      {children}
    </button>
  );
}

function FilterSelect({
  value, options, onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none rounded-lg px-3 py-2 pr-8 text-[13px] text-white cursor-pointer font-medium"
        style={{ background: "#1e3a5f", border: "none", fontFamily: "Sarabun, sans-serif", minWidth: 170 }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" width="10" height="6" fill="white" opacity="0.7">
        <path d="M0 0l5 6 5-6z" />
      </svg>
    </div>
  );
}

function GridStat({
  label, value, subValue, bordered, href,
}: {
  label: string;
  value: string | number;
  subValue?: string | number;
  bordered?: boolean;
  href?: string;
}) {
  const mainEl = href ? (
    <Link href={href} className="text-[20px] font-bold text-blue-600 underline block leading-none">
      {value}
    </Link>
  ) : (
    <p className="text-[20px] font-bold text-blue-600 underline cursor-pointer leading-none">{value}</p>
  );

  return (
    <div className={clsx("flex flex-col items-center justify-center py-2 px-2", bordered && "border-x border-slate-200")}>
      <p className="text-[11px] text-slate-500 mb-1.5">{label}</p>
      {mainEl}
      {subValue !== undefined && (
        <p className="text-[11px] text-slate-400 mt-1 underline cursor-pointer">{subValue}</p>
      )}
    </div>
  );
}
