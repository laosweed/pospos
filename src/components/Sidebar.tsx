"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge, Star, LayoutGrid, ChevronDown, ChevronLeft,
  Store, CreditCard, Coins, Users, ShoppingCart,
  ArrowUpDown, Settings, PieChart, BarChart2,
  FolderOpen, Package, Percent, UserCircle,
  Briefcase, HelpCircle, BookOpen, Tag,
  History, Receipt, Truck, Barcode, Layers,
  Download, RotateCcw, Building2, UserCog,
  Factory, Monitor, Smartphone, CalendarRange,
  Ticket, Gift, MessageCircle, CreditCard as CardIcon,
  DollarSign, Award, Package2, AlertCircle,
  HelpingHand, Cpu, Clock,
} from "lucide-react";
import clsx from "clsx";

// ─── Nav structure (matches real POSPOS go.pospos.co) ─────────
interface NavItem { label: string; icon: React.ReactNode; href: string }
interface NavSection { id: string; label: string; icon: React.ReactNode; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
  {
    id: "store", label: "หน้าร้าน", icon: <Store size={14} />,
    items: [
      { label: "หน้าขาย",        icon: <CreditCard size={14} />,  href: "/sell" },
      { label: "รับซื้อ",         icon: <Coins size={14} />,       href: "/buy" },
      { label: "ค้างจ่าย (หนี้)", icon: <Users size={14} />,       href: "/credit" },
      { label: "อีคอมเมิร์ซ",    icon: <ShoppingCart size={14} />, href: "/ecom" },
      { label: "เรียงลำดับ",     icon: <ArrowUpDown size={14} />,  href: "/sort" },
      { label: "ตั้งค่า",         icon: <Settings size={14} />,     href: "/settings" },
    ],
  },
  {
    id: "reports", label: "เอกสาร/รายงาน", icon: <PieChart size={14} />,
    items: [
      { label: "แดชบอร์ด",      icon: <Gauge size={14} />,       href: "/dashboard" },
      { label: "รายงาน",         icon: <BarChart2 size={14} />,    href: "/reports" },
      { label: "เอกสาร",         icon: <FolderOpen size={14} />,   href: "/documents" },
      { label: "ประวัติขาย",     icon: <Receipt size={14} />,      href: "/sale-history" },
      { label: "ประวัติสินค้า",  icon: <History size={14} />,      href: "/stock-history" },
      { label: "ค่าใช้จ่าย",     icon: <DollarSign size={14} />,   href: "/expenses" },
      { label: "เดลิเวอรี่",     icon: <Truck size={14} />,        href: "/delivery" },
      { label: "กะการขาย",       icon: <Clock size={14} />,        href: "/shift" },
    ],
  },
  {
    id: "products", label: "สินค้า", icon: <Package size={14} />,
    items: [
      { label: "สต็อก",           icon: <Package2 size={14} />,    href: "/stock" },
      { label: "บาร์โค้ด",        icon: <Barcode size={14} />,     href: "/barcode" },
      { label: "ท็อปปิ้ง/สูตร",   icon: <Layers size={14} />,      href: "/toppings" },
      { label: "นำเข้า/รับซื้อ",  icon: <Download size={14} />,    href: "/import-buy" },
      { label: "เบิก/คืนสินค้า",  icon: <RotateCcw size={14} />,   href: "/requisition" },
      { label: "เจ้าหนี้",         icon: <Building2 size={14} />,   href: "/creditor" },
      { label: "POSPOS Extra",     icon: <Package size={14} />,     href: "/extra" },
      { label: "โอนสินค้า",        icon: <ShoppingCart size={14} />, href: "/transfer" },
      { label: "ระดับราคา",        icon: <BarChart2 size={14} />,   href: "/price-levels" },
      { label: "ราคาขายส่ง",       icon: <Tag size={14} />,         href: "/wholesale" },
      { label: "สินค้า (SKU)",      icon: <Barcode size={14} />,    href: "/sku" },
      { label: "วันหมดอายุ",       icon: <AlertCircle size={14} />, href: "/expiration" },
    ],
  },
  {
    id: "promo", label: "โปรโมชั่น", icon: <Percent size={14} />,
    items: [
      { label: "โปรโมชั่น", icon: <Gift size={14} />,   href: "/promotions" },
      { label: "ส่วนลด",    icon: <Ticket size={14} />, href: "/discounts" },
    ],
  },
  {
    id: "crm", label: "CRM", icon: <UserCircle size={14} />,
    items: [
      { label: "ลูกค้า",             icon: <Users size={14} />,      href: "/customers" },
      { label: "แลกแต้มสะสม",        icon: <Award size={14} />,      href: "/points-exchange" },
      { label: "ตั้งค่าแต้มสะสม",    icon: <Settings size={14} />,   href: "/points-settings" },
    ],
  },
  {
    id: "admin", label: "บริหาร", icon: <Briefcase size={14} />,
    items: [
      { label: "สาขา",              icon: <Store size={14} />,         href: "/branches" },
      { label: "พนักงาน",            icon: <UserCog size={14} />,      href: "/employees" },
      { label: "ผู้ผลิต",            icon: <Factory size={14} />,      href: "/vendors" },
      { label: "เครื่อง POS",        icon: <Monitor size={14} />,      href: "/pos-machines" },
      { label: "กิจกรรม",            icon: <CalendarRange size={14} />, href: "/activity" },
      { label: "มอนิเตอร์โต๊ะ",      icon: <Monitor size={14} />,     href: "/table-monitor" },
      { label: "อุปกรณ์ที่เข้าสู่ระบบ", icon: <Smartphone size={14} />, href: "/devices" },
    ],
  },
  {
    id: "help", label: "ช่วยเหลือ", icon: <HelpCircle size={14} />,
    items: [
      { label: "คู่มือ",          icon: <BookOpen size={14} />,      href: "/manual" },
      { label: "แจ้งปัญหา",       icon: <MessageCircle size={14} />, href: "/report-problem" },
      { label: "แจ้งชำระเงิน",   icon: <CardIcon size={14} />,      href: "/payment-confirm" },
      { label: "แพคเกจ",         icon: <Package size={14} />,        href: "/package" },
      { label: "อุปกรณ์",         icon: <Cpu size={14} />,           href: "/hardware" },
      { label: "พาร์ทเนอร์",     icon: <HelpingHand size={14} />,   href: "/partners" },
    ],
  },
];

// ─── AdminLTE skin-blue color tokens ─────────────────────────
const COLORS = {
  sidebarBg: "#222d32",         // .main-sidebar background
  sidebarHeaderBg: "#1a2226",   // section header background
  sidebarHoverBg: "#1e282c",    // hover/active background
  sidebarText: "#b8c7ce",       // default text color
  sidebarTextMuted: "#4b646f",  // section header text
  activeBorderLeft: "#3c8dbc",  // active item accent
  activeBg: "#1e282c",          // active item bg
  activeText: "#ffffff",        // active item text
  userPanelBg: "#1a2226",       // user panel background
};

// ─── Sidebar ─────────────────────────────────────────────────
interface SidebarProps {
  storeName?: string;
  storeEmail?: string;
}

export default function Sidebar({
  storeName = "ร้านเบเกอรี่ (ตัวอย่าง)",
  storeEmail = "demo01@pospos.co",
}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({
    store: true,
    reports: true,
    products: false,
    promo: false,
    crm: false,
    admin: false,
    help: false,
  });

  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }));

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard" || pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className="sidebar-scroll fixed top-[50px] left-0 z-40 flex flex-col overflow-y-auto"
      style={{ background: COLORS.sidebarBg, width: 230, height: "calc(100vh - 50px)" }}
    >
      {/* ── User panel (AdminLTE style) ── */}
      <div className="px-3 py-3 flex-shrink-0" style={{ background: COLORS.userPanelBg }}>
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: COLORS.activeBorderLeft }}
          >
            {storeName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "#fff" }}>{storeName}</p>
            <p className="text-[11px] truncate" style={{ color: COLORS.sidebarTextMuted }}>{storeEmail}</p>
          </div>
        </div>
        <span
          className="inline-block text-white text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-sm"
          style={{ background: "#dd4b39" }}
        >
          DEMO
        </span>
        <span className="text-[10px] ml-2" style={{ color: COLORS.sidebarTextMuted }}>
          ระบบจะรีเซ็ตข้อมูลทุกวัน
        </span>
      </div>

      {/* ── Search menu (AdminLTE style) ── */}
      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            className="w-full text-[12px] pl-3 pr-8 py-1.5 rounded-sm border-0 focus:outline-none"
            style={{
              background: COLORS.sidebarHeaderBg,
              color: COLORS.sidebarText,
            }}
          />
          <LayoutGrid size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: COLORS.sidebarTextMuted }} />
        </div>
      </div>

      {/* ── Nav sections ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll">
        {NAV_SECTIONS.map(section => (
          <div key={section.id}>
            {/* Section header (AdminLTE: .sidebar-menu > li.header) */}
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center gap-2 px-4 py-2 text-left transition-colors"
              style={{
                background: COLORS.sidebarHeaderBg,
                borderTop: "1px solid rgba(0,0,0,0.25)",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span className="flex-shrink-0" style={{ color: COLORS.sidebarTextMuted }}>{section.icon}</span>
              <span
                className="flex-1 text-[11px] font-bold uppercase tracking-wider truncate"
                style={{ color: COLORS.sidebarTextMuted }}
              >
                {section.label}
              </span>
              <ChevronLeft
                size={10}
                style={{
                  color: COLORS.sidebarTextMuted,
                  flexShrink: 0,
                  transform: open[section.id] ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Items */}
            {open[section.id] && (
              <ul>
                {section.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 pl-5 pr-3 py-[7px] text-[13px] transition-colors group"
                        style={{
                          borderLeft: active ? `3px solid ${COLORS.activeBorderLeft}` : "3px solid transparent",
                          background: active ? COLORS.activeBg : undefined,
                          color: active ? COLORS.activeText : COLORS.sidebarText,
                        }}
                        onMouseEnter={e => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.background = COLORS.sidebarHoverBg;
                            (e.currentTarget as HTMLElement).style.color = COLORS.activeText;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.background = "";
                            (e.currentTarget as HTMLElement).style.color = COLORS.sidebarText;
                          }
                        }}
                      >
                        <span className="flex-shrink-0 w-[14px]">{item.icon}</span>
                        <span className="flex-1 truncate">{item.label}</span>
                        <Star
                          size={10}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-30 transition-opacity"
                          style={{ color: COLORS.sidebarText }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* ── Version footer ── */}
      <div
        className="px-4 py-2 text-[10px] flex-shrink-0"
        style={{
          color: COLORS.sidebarTextMuted,
          background: COLORS.sidebarHeaderBg,
          borderTop: "1px solid rgba(0,0,0,0.25)",
        }}
      >
        V 9.58.2
      </div>
    </aside>
  );
}
