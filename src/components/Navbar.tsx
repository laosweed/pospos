"use client";

import { useState } from "react";
import {
  Menu, ChevronDown, Calculator, RefreshCw,
  MapPin, Gauge, Bell, Globe,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/*
 * Exact CSS from go.pospos.co:
 *   .skin-blue .main-header .navbar          → background: #0d6eb3
 *   .sidebar-toggle:hover                    → background: #128fe9
 *   .skin-blue .main-header .navbar .nav>.active>a → background: #128fe9
 *   .main-header .logo                       → height: 50px; width: 200px (matches sidebar)
 *   .main-header .navbar                     → min-height: 50px; margin-left: 200px
 *   .main-header .navbar .nav>li>a           → padding-top:15px; padding-bottom:15px; line-height:20px
 *   .main-header .navbar .nav>li>a>.label    → position:absolute; top:9px; right:7px; font-size:9px
 */

const N = {
  bg: "#0d6eb3",             // .skin-blue .main-header .navbar { background }
  logoBg: "#0d6eb3",         // same as navbar in POSPOS (no separate logo bg)
  hoverBg: "#128fe9",        // .sidebar-toggle:hover, .nav>.active>a { background }
  text: "#fff",
  textMuted: "rgba(255,255,255,0.7)",
  height: 50,
  sidebarWidth: 200,         // matches sidebar width
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
      style={{ background: N.bg, height: N.height }}
    >
      {/* Logo — .main-header .logo { width: 200px; height: 50px } */}
      <div
        className="flex items-center justify-center flex-shrink-0 h-full select-none"
        style={{ background: N.logoBg, width: N.sidebarWidth }}
      >
        <span className="font-extrabold text-white text-lg tracking-tight">
          POS<span style={{ color: "#d2e7f5" }}>POS</span>
        </span>
      </div>

      {/* Sidebar toggle — .main-header .sidebar-toggle { padding:15px 15px } */}
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center h-full transition-colors"
        style={{ color: N.text, padding: "15px 15px" }}
        onMouseEnter={e => (e.currentTarget.style.background = N.hoverBg)}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
      >
        <Menu size={18} />
      </button>

      {/* Page breadcrumb area */}
      <div className="hidden md:flex items-center gap-2 text-white ml-2">
        <span className="flex items-center justify-center rounded-full w-7 h-7" style={{ background: "rgba(0,0,0,0.15)" }}>
          <Gauge size={13} />
        </span>
        <span className="text-sm font-medium">{storeName}</span>
      </div>

      <div className="flex-1" />

      {/* Right side — .navbar-custom-menu */}
      <div className="flex items-center h-full">
        <NavBtn title="เครื่องคิดเลข"><Calculator size={16} /></NavBtn>
        <NavBtn title="รีเฟรช"><RefreshCw size={16} /></NavBtn>
        <NavBtn title="แจ้งเตือน" badge={3}><Bell size={16} /></NavBtn>
        <NavBtn title="สาขา"><MapPin size={16} /></NavBtn>

        {/* User dropdown — .navbar-nav>.user-menu */}
        <div className="relative h-full">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-2 h-full px-3 transition-colors"
            style={{ color: N.text, paddingTop: 15, paddingBottom: 15, lineHeight: "20px" }}
            onMouseEnter={e => (e.currentTarget.style.background = N.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "")}
          >
            {/* .user-image { width:25px; height:25px; border-radius:50% } */}
            <span className="w-[25px] h-[25px] rounded-full bg-emerald-400 text-emerald-900 text-[10px] font-bold flex items-center justify-center select-none" style={{ marginTop: -2 }}>
              {employeeName.charAt(0)}
            </span>
            <span className="text-sm hidden sm:inline">{employeeName}</span>
            <ChevronDown size={11} style={{ color: N.textMuted }} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              {/* .navbar-nav>.user-menu>.dropdown-menu { width:280px } */}
              <div className="absolute right-0 top-[50px] bg-white shadow-xl py-0 z-50" style={{ width: 280, borderRadius: "0 0 4px 4px", border: "1px solid #ddd", borderTop: 0 }}>
                {/* li.user-header { height:175px; background-color:#3c8dbc } — simplified */}
                <div className="px-4 py-4 text-center" style={{ background: N.bg }}>
                  <div className="w-[90px] h-[90px] rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-2">
                    {employeeName.charAt(0)}
                  </div>
                  <p className="text-white text-[17px]">{employeeName}</p>
                  <p className="text-white/80 text-[12px]">Manager</p>
                </div>
                {/* .user-footer { background-color:#f9f9f9; padding:10px } */}
                <div className="p-2.5" style={{ background: "#f9f9f9" }}>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-center text-sm rounded border border-slate-300 text-slate-600 hover:bg-slate-100">
                      โปรไฟล์
                    </button>
                    <button onClick={handleLogout} className="flex-1 py-2 text-center text-sm rounded border border-red-300 text-red-500 hover:bg-red-50">
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Language */}
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
      className="relative flex items-center justify-center h-full transition-colors"
      // .main-header .navbar .nav>li>a { padding-top:15px; padding-bottom:15px; line-height:20px }
      style={{ color: N.text, paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, lineHeight: "20px" }}
      onMouseEnter={e => (e.currentTarget.style.background = N.hoverBg)}
      onMouseLeave={e => (e.currentTarget.style.background = "")}
    >
      {children}
      {badge != null && badge > 0 && (
        /* .main-header .navbar .nav>li>a>.label { position:absolute; top:9px; right:7px; font-size:9px } */
        <span
          className="absolute flex items-center justify-center text-white rounded-full px-1"
          style={{ top: 9, right: 7, fontSize: 9, padding: "2px 3px", lineHeight: 0.9, background: "#dd4b39", minWidth: 16 }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
