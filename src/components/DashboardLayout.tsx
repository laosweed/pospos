"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import type { Store, Employee } from "@/lib/supabase/types";

interface DashboardLayoutProps {
  store: Store;
  employee: Employee;
  children: React.ReactNode;
}

export default function DashboardLayout({
  store,
  employee,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        storeName={store.name}
        employeeName={employee.name}
      />

      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && (
          <Sidebar
            storeName={store.name}
            storeEmail={employee.email ?? ""}
          />
        )}

        <main
          className="flex-1 min-h-[calc(100vh-50px)]"
          style={{ marginLeft: sidebarOpen ? 230 : 0 }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
