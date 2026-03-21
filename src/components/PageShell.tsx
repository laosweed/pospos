"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <Navbar
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        storeName="ร้านเบเกอรี่ (ตัวอย่าง)"
        employeeName="ชนิ่น เกษมทรัพย์"
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
