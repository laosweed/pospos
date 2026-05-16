"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

interface StubLayoutProps {
  title: string;
}

export default function StubLayout({ title }: StubLayoutProps) {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main
          className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4 min-h-[calc(100vh-50px)]"
          style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg text-4xl"
            style={{ background: "#0d6eb3" }}
          >
            📋
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-700 mb-2">{title}</h1>
            <p className="text-slate-500 text-sm">{t("common_loading")}</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ background: "#0d6eb3" }}
          >
            ← {t("item_dashboard")}
          </Link>
        </main>
      </div>
    </>
  );
}
