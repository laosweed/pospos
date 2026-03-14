"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge, Star, LayoutGrid, ChevronDown,
  Store, CreditCard, Coins, Users, ShoppingCart,
  ArrowUpDown, Settings, PieChart, BarChart2,
  FolderOpen, Package, Percent, UserCircle,
  Briefcase, HelpCircle, BookOpen, Headphones, Tag,
  History, Receipt, Truck, Barcode, Layers,
  Download, RotateCcw, Building2, UserCog,
  Factory, Monitor, Smartphone, CalendarRange,
  Ticket, Gift, MessageCircle, CreditCard as CardIcon,
  DollarSign, Award, Package2, AlertCircle,
  HelpingHand, Cpu,
} from "lucide-react";
import clsx from "clsx";

// ─── Nav structure ──────────────────────────────────────────
interface NavItem { label: string; icon: React.ReactNode; href: string }
interface NavSection { id: string; label: string; icon: React.ReactNode; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
  {
    id: "store", label: "หน้าร้าน", icon: <Store size={13} />,
    items: [
      { label: "หน้าขาย",        icon: <CreditCard size={11} />,  href: "/sell" },
      { label: "รับซื้อ",         icon: <Coins size={11} />,       href: "/buy" },
      { label: "ค้างจ่าย (หนี้)", icon: <Users size={11} />,       href: "/credit" },
      { label: "อีคอมเมิร์ซ",    icon: <ShoppingCart size={11} />, href: "/ecom" },
      { label: "เรียงลำดับ",     icon: <ArrowUpDown size={11} />,  href: "/sort" },
      { label: "ตั้งค่า",         icon: <Settings size={11} />,     href: "/settings" },
    ],
  },
  {
    id: "reports", label: "เอกสาร/รายงาน", icon: <PieChart size={13} />,
    items: [
      { label: "แดชบอร์ด",      icon: <Gauge size={11} />,       href: "/dashboard" },
      { label: "รายงาน",         icon: <BarChart2 size={11} />,    href: "/reports" },
      { label: "เอกสาร",         icon: <FolderOpen size={11} />,   href: "/documents" },
      { label: "ประวัติขาย",     icon: <Receipt size={11} />,      href: "/sale-history" },
      { label: "ประวัติสินค้า",  icon: <History size={11} />,      href: "/stock-history" },
      { label: "ค่าใช้จ่าย",     icon: <DollarSign size={11} />,   href: "/expenses" },
      { label: "เดลิเวอรี่",     icon: <Truck size={11} />,        href: "/delivery" },
    ],
  },
  {
    id: "products", label: "สินค้า", icon: <Package size={13} />,
    items: [
      { label: "สต็อก",           icon: <Package2 size={11} />,    href: "/stock" },
      { label: "บาร์โค้ด",        icon: <BarCode size={11} />,     href: "/barcode" },
      { label: "ท็อปปิ้ง/สูตร",   icon: <Layers size={11} />,      href: "/toppings" },
      { label: "นำเข้า/รับซื้อ",  icon: <Download size={11} />,    href: "/import-buy" },
      { label: "เบิก/คืนสินค้า",  icon: <RotateCcw size={11} />,   href: "/requisition" },
      { label: "เจ้าหนี้",         icon: <Building2 size={11} />,   href: "/creditor" },
      { label: "POSPOS Extra",     icon: <Package size={11} />,     href: "/extra" },
      { label: "โอนสินค้า",        icon: <ShoppingCart size={11} />, href: "/transfer" },
      { label: "ระดับราคา",        icon: <BarChart2 size={11} />,   href: "/price-levels" },
      { label: "ราคาขายส่ง",       icon: <Tag size={11} />,         href: "/wholesale" },
      { label: "สินค้า (SKU)",      icon: <BarCode size={11} />,    href: "/sku" },
      { label: "วันหมดอายุ",       icon: <AlertCircle size={11} />, href: "/expiration" },
    ],
  },
  {
    id: "promo", label: "โปรโมชั่น", icon: <Percent size={13} />,
    items: [
      { label: "โปรโมชั่น", icon: <Gift size={11} />,   href: "/promotions" },
      { label: "ส่วนลด",    icon: <Ticket size={11} />, href: "/discounts" },
    ],
  },
  {
    id: "crm", label: "CRM", icon: <UserCircle size={13} />,
    items: [
      { label: "ลูกค้า",             icon: <Users size={11} />,      href: "/customers" },
      { label: "แลกแต้มสะสม",        icon: <Award size={11} />,      href: "/points-exchange" },
      { label: "ตั้งค่าแต้มสะสม",    icon: <Settings size={11} />,   href: "/points-settings" },
    ],
  },
  {
    id: "admin", label: "บริหาร", icon: <Briefcase size={13} />,
    items: [
      { label: "สาขา",                   icon: <Store size={11} />,       href: "/branches" },
      { label: "พนักงาน",                 icon: <UserCog size={11} />,     href: "/employees" },
      { label: "ผู้ผลิต",                 icon: <Factory size={11} />,     href: "/vendors" },
      { label: "เครื่อง POS",             icon: <Monitor size={11} />,     href: "/pos-machines" },
      { label: "กิจกรรม",                 icon: <CalendarRange size={11} />, href: "/activity" },
      { label: "มอนิเตอร์โต๊ะ",           icon: <Monitor size={11} />,     href: "/table-monitor" },
      { label: "อุปกรณ์ที่เข้าสู่ระบบ", icon: <Smartphone size={11} />,  href: "/devices" },
    ],
  },
  {
    id: "help", label: "ช่วยเหลือ", icon: <HelpCircle size={13} />,
    items: [
      { label: "คู่มือ",          icon: <BookOpen size={11} />,   href: "/manual" },
      { label: "แจ้งปัญหา",       icon: <MessageCircle size={11} />, href: "/report-problem" },
      { label: "แจ้งชำระเงิน",   icon: <CardIcon size={11} />,   href: "/payment-confirm" },
      { label: "แพคเกจ",         icon: <Package size={11} />,     href: "/package" },
      { label: "อุปกรณ์",         icon: <Cpu size={11} />,        href: "/hardware" },
      { label: "พาร์ทเนอร์",     icon: <HelpingHand size={11} />, href: "/partners" },
    ],
  },
];

// Minimal BarCode icon (lucide doesn't have one, use Barcode)
function BarCode({ size }: { size: number }) {
  return <Barcode size={size} />;
}

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
      style={{ background: "#172944", width: 230, height: "calc(100vh - 50px)" }}
    >
      {/* ── DEMO badge ── */}
      <div className="px-3.5 py-3 border-b border-white/[0.07] flex-shrink-0">
        <span
          className="inline-block text-white text-[11px] font-bold tracking-widest px-3 py-0.5 rounded-full mb-1.5"
          style={{ background: "linear-gradient(90deg,#ff003d 0%,#ffc4bd 50%,#ff738b 100%)" }}
        >
          DEMO
        </span>
        <p className="text-[11px] mb-1.5" style={{ color: "#8aa4af" }}>
          ระบบจะรีเซ็ตข้อมูลทุกวัน
        </p>
        <p className="text-[13px] font-semibold" style={{ color: "#cbd5e1" }}>{storeName}</p>
        <p className="text-[12px]" style={{ color: "#64748b" }}>{storeEmail}</p>
      </div>

      {/* ── Quick icons ── */}
      <div
        className="flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.05] flex-shrink-0"
        style={{ background: "#0f1e33" }}
      >
        <QuickBtn active title="แดชบอร์ด"><Gauge size={13} /></QuickBtn>
        <QuickBtn title="รายการโปรด"><Star size={13} /></QuickBtn>
        <QuickBtn title="เมนูทั้งหมด"><LayoutGrid size={13} /></QuickBtn>
        <div className="flex-1" />
        <QuickBtn title="ย่อขยาย"><ChevronDown size={10} /></QuickBtn>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll">
        {NAV_SECTIONS.map(section => (
          <div key={section.id}>
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 text-left hover:bg-white/[0.04] border-t border-white/[0.06] transition-colors"
            >
              <span className="flex-shrink-0" style={{ color: "#94a3b8" }}>{section.icon}</span>
              <span className="flex-1 text-[12.5px] font-semibold truncate" style={{ color: "#94a3b8" }}>
                {section.label}
              </span>
              <ChevronDown
                size={10}
                style={{
                  color: "#64748b",
                  flexShrink: 0,
                  transform: open[section.id] ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {open[section.id] && (
              <ul>
                {section.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 pl-6 pr-3 py-[8px] text-[13px] transition-colors group"
                        style={{
                          background: active ? "#337ab7" : undefined,
                          color: active ? "#fff" : "#8aa4af",
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        <span className="flex-shrink-0" style={{ width: 13 }}>{item.icon}</span>
                        <span className="flex-1 truncate">{item.label}</span>
                        <Star
                          size={10}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity"
                          style={{ color: "#94a3b8" }}
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
    </aside>
  );
}

function QuickBtn({ children, active, title }: { children: React.ReactNode; active?: boolean; title?: string }) {
  return (
    <button
      title={title}
      className={clsx(
        "flex items-center justify-center w-8 h-8 rounded-full transition-all",
        active ? "bg-white/20 text-white" : "text-[#94a3b8] hover:bg-white/15 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
