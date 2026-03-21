"use client";

import { useState } from "react";
import {
  Menu, ChevronDown, Calculator, RefreshCw,
  MapPin, Gauge, Bell, Globe,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/* AdminLTE skin-blue header colors */
const COLORS = {
  navbarBg: "#3c8dbc",        // .skin-blue .main-header .navbar
  logoBg: "#367fa9",           // .skin-blue .main-header .logo
  logoHoverBg: "#357ca5",     // .skin-blue .main-header .logo:hover
  hoverBg: "rgba(0,0,0,0.1)", // hover state
  text: "#fff",
  textMuted: "rgba(255,255,255,0.7)",
};

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center"
      style={{ background: COLORS.navbarBg, height: 50 }}
    >
      {/* Logo area */}
      <div
        className="flex items-center justify-center flex-shrink-0 h-full px-4 select-none"
        style={{ background: COLORS.logoBg, width: 230 }}
      >
        <span className="font-extrabold text-white text-lg tracking-tight">
          POS<span style={{ color: "#d2e7f5" }}>POS</span>
        </span>
      </div>

      {/* Hamburger toggle */}
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-[50px] h-full transition-colors"
        style={{ color: COLORS.text }}
        onMouseEnter={e => (e.currentTarget.style.background = COLORS.hoverBg)}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
      >
        <Menu size={18} />
      </button>

      {/* Page title / breadcrumb area */}
      <div className="hidden md:flex items-center gap-2 text-white ml-2">
        <span className="flex items-center justify-center rounded-full w-7 h-7" style={{ background: "rgba(0,0,0,0.15)" }}>
          <Gauge size={13} />
        </span>
        <span className="text-sm font-medium">{storeName}</span>
      </div>

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center h-full">
        <NavBtn title="เครื่องคิดเลข"><Calculator size={16} /></NavBtn>
        <NavBtn title="รีเฟรช"><RefreshCw size={16} /></NavBtn>
        <NavBtn title="แจ้งเตือน" badge={3}><Bell size={16} /></NavBtn>
        <NavBtn title="สาขา"><MapPin size={16} /></NavBtn>

        {/* User dropdown */}
        <div className="relative h-full">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-2 h-full px-3 transition-colors"
            style={{ color: COLORS.text }}
            onMouseEnter={e => (e.currentTarget.style.background = COLORS.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "")}
          >
            <span className="w-7 h-7 rounded-full bg-emerald-400 text-emerald-900 text-xs font-bold flex items-center justify-center select-none">
              {employeeName.charAt(0)}
            </span>
            <span className="text-sm hidden sm:inline">{employeeName}</span>
            <ChevronDown size={11} style={{ color: COLORS.textMuted }} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-[50px] bg-white rounded-b-md shadow-xl border border-slate-200 py-1 min-w-48 z-50">
                <div className="px-4 py-3 border-b border-slate-100" style={{ background: COLORS.navbarBg }}>
                  <div className="text-sm font-semibold text-white">{employeeName}</div>
                  <div className="text-xs text-white/70">Manager</div>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  โปรไฟล์
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  เปลี่ยนรหัสผ่าน
                </button>
                <div className="border-t border-slate-100" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                  ออกจากระบบ
                </button>
              </div>
            </>
          )}
        </div>

        {/* Language flag */}
        <NavBtn title="ภาษา"><Globe size={16} /></NavBtn>
      </div>
    </nav>
  );
}

function NavBtn({
  children,
  title,
  badge,
}: {
  children: React.ReactNode;
  title?: string;
  badge?: number;
}) {
  return (
    <button
      title={title}
      className="relative flex items-center justify-center w-[42px] h-full transition-colors"
      style={{ color: COLORS.text }}
      onMouseEnter={e => (e.currentTarget.style.background = COLORS.hoverBg)}
      onMouseLeave={e => (e.currentTarget.style.background = "")}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="absolute top-2 right-1.5 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold text-white rounded-full px-1"
          style={{ background: "#dd4b39" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
