import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/DashboardLayout";
import StoreBanner from "@/components/StoreBanner";
import ActionButtons from "@/components/ActionButtons";
import DashboardStats from "@/components/DashboardStats";
import type { Store, Employee, DailySalesSummary } from "@/lib/supabase/types";
import type { HourlyPoint } from "@/components/DashboardStats";

// ─── Demo fallback data ───────────────────────────────────
const DEMO_STORE: Store = {
  id: "demo", name: "ร้านเบเกอรี่ (ตัวอย่าง)",
  image_url: null, pos_name: "POS #1",
  vat_enabled: true, demo: true,
  created_at: new Date().toISOString(),
};
const DEMO_EMPLOYEE: Employee = {
  id: "demo-emp", store_id: "demo",
  name: "ชนิ่น เกษมทรัพย์", email: "demo01@pospos.co",
  role: "manager", phone: null, active: true, avatar_url: null,
  created_at: new Date().toISOString(),
};

/** Build a realistic bell-curve sales pattern for yesterday */
function mockYesterdayHourly(): HourlyPoint[] {
  // Peaks: morning rush ~10:00, lunch ~12:00, afternoon ~16:00
  const profile = [0,0,0,0,0,0,0,50,150,900,1200,800,1100,700,400,850,400,200,100,50,0,0,0,0];
  return Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2,"0")}.00`,
    today: 0,
    yesterday: profile[h] ?? 0,
  }));
}

// ─── Data fetching ────────────────────────────────────────
async function fetchData() {
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

  if (!isConfigured) {
    return {
      store: DEMO_STORE,
      employee: DEMO_EMPLOYEE,
      employees: [DEMO_EMPLOYEE],
      todaySummary: null,
      yesterdaySummary: {
        store_id: "demo",
        sale_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        total_bills: 16,
        cancelled_bills: 0,
        total_revenue: 4251.95,
        avg_per_bill: 265.75,
      } as DailySalesSummary,
      hourlyData: mockYesterdayHourly(),
    };
  }

  const sb = await createClient();

  // Store
  const { data: storeData } = await sb.from("stores").select("*").limit(1).single();
  const store: Store = storeData ?? DEMO_STORE;

  // Employees
  const { data: empData } = await sb.from("employees").select("*").eq("store_id", store.id).order("name");
  const employees: Employee[] = empData ?? [DEMO_EMPLOYEE];
  const employee = employees[0] ?? DEMO_EMPLOYEE;

  const todayDate     = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Summaries
  const [{ data: todayRow }, { data: yestRow }] = await Promise.all([
    sb.from("daily_sales_summary").select("*").eq("store_id", store.id).eq("sale_date", todayDate).single(),
    sb.from("daily_sales_summary").select("*").eq("store_id", store.id).eq("sale_date", yesterdayDate).single(),
  ]);

  // Hourly sales for today + yesterday
  const since = new Date(); since.setHours(0,0,0,0);
  const yestStart = new Date(since.getTime() - 86400000);
  const yestEnd   = new Date(since.getTime() - 1);

  const [{ data: todayRows }, { data: yestRows }] = await Promise.all([
    sb.from("sales").select("sold_at,total").eq("store_id", store.id)
      .eq("status","completed").gte("sold_at", since.toISOString()),
    sb.from("sales").select("sold_at,total").eq("store_id", store.id)
      .eq("status","completed").gte("sold_at", yestStart.toISOString()).lte("sold_at", yestEnd.toISOString()),
  ]);

  // Bucket into hourly maps
  const todayMap:  Record<string, number> = {};
  const yestMap:   Record<string, number> = {};
  for (let h = 0; h < 24; h++) {
    const key = `${String(h).padStart(2,"0")}.00`;
    todayMap[key] = 0;
    yestMap[key]  = 0;
  }
  ((todayRows ?? []) as unknown as { sold_at: string; total: number }[]).forEach(s => {
    const key = `${String(new Date(s.sold_at).getHours()).padStart(2,"0")}.00`;
    todayMap[key] = (todayMap[key] ?? 0) + (s.total ?? 0);
  });
  ((yestRows ?? []) as unknown as { sold_at: string; total: number }[]).forEach(s => {
    const key = `${String(new Date(s.sold_at).getHours()).padStart(2,"0")}.00`;
    yestMap[key] = (yestMap[key] ?? 0) + (s.total ?? 0);
  });

  const hourlyData: HourlyPoint[] = Object.keys(todayMap).map(hour => ({
    hour,
    today:     todayMap[hour],
    yesterday: yestMap[hour],
  }));

  return {
    store, employee, employees,
    todaySummary:     (todayRow ?? null) as DailySalesSummary | null,
    yesterdaySummary: (yestRow  ?? null) as DailySalesSummary | null,
    hourlyData,
  };
}

// ─── Page ─────────────────────────────────────────────────
export default async function DashboardPage() {
  const { store, employee, employees, todaySummary, yesterdaySummary, hourlyData } = await fetchData();

  return (
    <DashboardLayout store={store} employee={employee}>
      <StoreBanner store={store} />
      <ActionButtons />
      <DashboardStats
        store={store}
        employees={employees}
        todaySummary={todaySummary}
        yesterdaySummary={yesterdaySummary}
        hourlyData={hourlyData}
      />
      <footer
        className="text-right text-[12px] text-slate-500 px-5 py-3"
        style={{ background: "#bfdbfe" }}
      >
        Copyright © 2010–2026 CodeMobiles Co., Ltd. All Rights Reserved.
      </footer>
    </DashboardLayout>
  );
}
