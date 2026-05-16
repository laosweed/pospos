"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { supabase, STORE_ID } from "@/lib/supabase/browser";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employeeName, setEmployeeName] = useState("ชนิ่น เกษมทรัพย์");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("employees")
        .select("name, avatar_url")
        .eq("store_id", STORE_ID)
        .eq("active", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      setEmployeeName(data.name);
      if (data.avatar_url) setAvatarUrl(data.avatar_url);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Navbar
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        storeName="ร้านเบเกอรี่ (ตัวอย่าง)"
        employeeName={employeeName}
        avatarUrl={avatarUrl}
      />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main
          className={className ?? "flex-1 min-h-[calc(100vh-50px)] overflow-auto"}
          style={{
            marginLeft: sidebarOpen ? 200 : 0,
            background: "#edf1f5",
            transition: "margin-left 0.3s",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
