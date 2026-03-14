"use client";

import { useState } from "react";
import {
  Menu, ChevronDown, Calculator, RefreshCw,
  MapPin, Gauge,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface NavbarProps {
  onToggleSidebar: () => void;
  storeName?: string;
  employeeName?: string;
}

export default function Navbar({
  onToggleSidebar,
  storeName = "ร้านเบเกอรี่ (ตัวอย่าง)",
  employeeName = "ชนิ่น เกษมทรัพย์",
}: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-1 px-3"
      style={{ background: "#0d6eb3", height: 50 }}
    >
      {/* Logo */}
      <span className="font-extrabold text-white text-lg tracking-tight mr-2 select-none">
        POS<span className="text-sky-300">POS</span>
      </span>

      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="text-white/80 hover:text-white hover:bg-white/15 rounded p-1.5 transition-colors"
      >
        <Menu size={18} />
      </button>
      <button className="text-white/60 hover:text-white hover:bg-white/15 rounded p-1 transition-colors">
        <ChevronDown size={13} />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2 text-white ml-1">
        <span className="flex items-center justify-center bg-white/20 rounded-full w-7 h-7">
          <Gauge size={13} />
        </span>
        <span className="text-sm font-medium">แดชบอร์ด</span>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1 text-white">
        <button className="hover:bg-white/15 rounded p-1.5 transition-colors text-white/80 hover:text-white">
          <Calculator size={16} />
        </button>
        <button className="hover:bg-white/15 rounded p-1.5 transition-colors text-white/80 hover:text-white">
          <RefreshCw size={16} />
        </button>
        <button className="hover:bg-white/15 rounded p-1.5 transition-colors text-white/80 hover:text-white">
          <MapPin size={16} />
        </button>

        {/* User */}
        <div className="relative ml-1">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-white/15 px-2 py-1 rounded transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-400 text-emerald-900 text-xs font-bold flex items-center justify-center select-none">
              ช
            </span>
            <span className="text-sm">{employeeName}</span>
            <ChevronDown size={11} className="text-white/70" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-slate-100 py-1 min-w-44 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-700">{employeeName}</div>
                <div className="text-xs text-slate-400">Manager</div>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                โปรไฟล์
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>

        {/* Thai flag */}
        <span className="text-lg ml-1">🇹🇭</span>
      </div>
    </nav>
  );
}
