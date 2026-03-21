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

/*
 * Exact color tokens extracted from go.pospos.co CSS:
 *
 * .main-sidebar, .left-side       → background: none (transparent over wrapper)
 * .sidebar-menu li.menu-items     → background: #131820; color: #728b97
 * .sidebar-menu>li:hover>a,
 * .sidebar-menu>li.active>a,
 * .sidebar-menu>li.menu-open>a    → color: #94a3b8; background: #172944
 * li.active>a                     → background: #337ab7; font-weight: bolder
 * .sidebar-menu .treeview-menu>li>a → color: #8aa4af
 * .sidebar-menu .treeview-menu>li:hover>a → color: #fff
 * .sidebar-toggle:hover           → background: #128fe9
 * .main-sidebar                   → width: 200px
 * .content-wrapper                → margin-left: 200px; background: #edf1f5
 */
const S = {
  width: 200,                       // .main-sidebar { width: 200px }
  menuItemsBg: "#131820",           // .sidebar-menu li.menu-items { background }
  menuItemsText: "#728b97",         // .sidebar-menu li.menu-items { color }
  sectionOpenBg: "#172944",         // .sidebar-menu>li.menu-open>a { background }
  sectionOpenText: "#94a3b8",       // .sidebar-menu>li.menu-open>a { color }
  subItemText: "#8aa4af",           // .treeview-menu>li>a { color }
  subItemHoverText: "#fff",         // .treeview-menu>li:hover>a { color }
  activeItemBg: "#337ab7",          // li.active>a { background }
  activeItemText: "#fff",           // li.active>a { color }
  userPanelBg: "#131820",           // same as menu-items
  searchBg: "#374850",              // .sidebar-form input { background-color }
  searchBorder: "#374850",          // .sidebar-form { border }
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
      style={{ background: S.menuItemsBg, width: S.width, height: "calc(100vh - 50px)" }}
    >
      {/* ── User panel ── */}
      <div className="px-2.5 py-2.5 flex-shrink-0" style={{ background: S.userPanelBg }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "#0d6eb3" }}
          >
            {storeName.charAt(0)}
          </div>
          <div className="min-w-0" style={{ lineHeight: 1 }}>
            <p className="text-[13px] font-semibold truncate mb-1" style={{ color: "#fff" }}>{storeName}</p>
            <p className="text-[11px] truncate" style={{ color: S.menuItemsText }}>{storeEmail}</p>
          </div>
        </div>
        <span
          className="inline-block text-white text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-sm"
          style={{ background: "linear-gradient(90deg,#ff003d 0%,#ffc4bd 50%,#ff738b 100%)" }}
        >
          DEMO
        </span>
        <span className="text-[10px] ml-1.5" style={{ color: S.menuItemsText }}>
          ระบบจะรีเซ็ตข้อมูลทุกวัน
        </span>
      </div>

      {/* ── Search (sidebar-form) ── */}
      <div className="px-2.5 py-2 flex-shrink-0">
        <div
          className="flex rounded-[3px]"
          style={{ border: `1px solid ${S.searchBorder}`, margin: 0 }}
        >
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            className="flex-1 text-[12px] px-2.5 py-1 border-0 focus:outline-none rounded-l-[2px]"
            style={{ background: S.searchBg, color: "#666", height: 35, boxShadow: "none" }}
          />
          <button
            className="px-2.5 flex items-center justify-center rounded-r-[2px]"
            style={{ background: S.searchBg, color: "#999", height: 35, border: "1px solid transparent", boxShadow: "none" }}
          >
            <LayoutGrid size={13} />
          </button>
        </div>
      </div>

      {/* ── Nav sections ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll">
        {NAV_SECTIONS.map(section => {
          const isOpen = open[section.id];
          return (
            <div key={section.id} style={{ background: S.menuItemsBg }}>
              {/* Section header — .sidebar-menu > li.header */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-2 text-left transition-colors"
                style={{
                  padding: "10px 15px",               // .sidebar-menu li.header { padding }
                  fontSize: 12,
                  background: isOpen ? S.sectionOpenBg : S.menuItemsBg,
                  color: isOpen ? S.sectionOpenText : S.menuItemsText,
                  cursor: "pointer",
                }}
              >
                <span className="flex-shrink-0">{section.icon}</span>
                <span className="flex-1 font-semibold truncate">
                  {section.label}
                </span>
                <ChevronLeft
                  size={11}
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.5s ease",  // AdminLTE transition
                  }}
                />
              </button>

              {/* Sub-items — .treeview-menu */}
              {isOpen && (
                <ul style={{ paddingLeft: 20 }}>
                  {section.items.map(item => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 text-[14px] transition-colors group"
                          style={{
                            // .treeview-menu>li>a { padding: 5px 5px 5px 15px }
                            padding: "5px 5px 5px 15px",
                            display: "block",
                            background: active ? S.activeItemBg : undefined,
                            color: active ? S.activeItemText : S.subItemText,
                            fontWeight: active ? "bolder" : "normal",
                          }}
                          onMouseEnter={e => {
                            if (!active) {
                              (e.currentTarget as HTMLElement).style.color = S.subItemHoverText;
                            }
                          }}
                          onMouseLeave={e => {
                            if (!active) {
                              (e.currentTarget as HTMLElement).style.color = S.subItemText;
                            }
                          }}
                        >
                          <span className="flex-shrink-0" style={{ width: 20 }}>{item.icon}</span>
                          <span className="flex-1 truncate">{item.label}</span>
                          <Star
                            size={10}
                            className="flex-shrink-0 opacity-0 group-hover:opacity-30 transition-opacity"
                            style={{ color: S.subItemText }}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Version footer ── */}
      <div
        className="px-4 py-2 text-[10px] flex-shrink-0"
        style={{ color: S.menuItemsText, background: S.menuItemsBg }}
      >
        V 9.58.2
      </div>
    </aside>
  );
}
