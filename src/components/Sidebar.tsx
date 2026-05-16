"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge, Star, LayoutGrid, ChevronLeft, ChevronDown,
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
import { useLanguage } from "@/context/LanguageContext";
import type { Dict } from "@/i18n/types";

// ─── Nav structure (matches real POSPOS go.pospos.co) ─────────
interface NavItem { labelKey: keyof Dict; icon: React.ReactNode; href: string }
interface NavSection { id: string; labelKey: keyof Dict; icon: React.ReactNode; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
  {
    id: "store", labelKey: "sec_store", icon: <Store size={14} />,
    items: [
      { labelKey: "item_sell",     icon: <CreditCard size={14} />,  href: "/sell" },
      { labelKey: "item_buy",      icon: <Coins size={14} />,       href: "/buy" },
      { labelKey: "item_credit",   icon: <Users size={14} />,       href: "/credit" },
      { labelKey: "item_ecom",     icon: <ShoppingCart size={14} />, href: "/ecom" },
      { labelKey: "item_sort",     icon: <ArrowUpDown size={14} />,  href: "/sort" },
      { labelKey: "item_settings", icon: <Settings size={14} />,     href: "/settings" },
    ],
  },
  {
    id: "reports", labelKey: "sec_reports", icon: <PieChart size={14} />,
    items: [
      { labelKey: "item_dashboard",    icon: <Gauge size={14} />,       href: "/dashboard" },
      { labelKey: "item_reports",      icon: <BarChart2 size={14} />,    href: "/reports" },
      { labelKey: "item_documents",    icon: <FolderOpen size={14} />,   href: "/documents" },
      { labelKey: "item_sale_history", icon: <Receipt size={14} />,      href: "/sale-history" },
      { labelKey: "item_stock_history",icon: <History size={14} />,      href: "/stock-history" },
      { labelKey: "item_expenses",     icon: <DollarSign size={14} />,   href: "/expenses" },
      { labelKey: "item_delivery",     icon: <Truck size={14} />,        href: "/delivery" },
      { labelKey: "item_shift",        icon: <Clock size={14} />,        href: "/shift" },
    ],
  },
  {
    id: "products", labelKey: "sec_products", icon: <Package size={14} />,
    items: [
      { labelKey: "item_stock",        icon: <Package2 size={14} />,    href: "/stock" },
      { labelKey: "item_barcode",      icon: <Barcode size={14} />,     href: "/barcode" },
      { labelKey: "item_toppings",     icon: <Layers size={14} />,      href: "/toppings" },
      { labelKey: "item_import_buy",   icon: <Download size={14} />,    href: "/import-buy" },
      { labelKey: "item_requisition",  icon: <RotateCcw size={14} />,   href: "/requisition" },
      { labelKey: "item_creditor",     icon: <Building2 size={14} />,   href: "/creditor" },
      { labelKey: "item_extra",        icon: <Package size={14} />,     href: "/extra" },
      { labelKey: "item_transfer",     icon: <ShoppingCart size={14} />, href: "/transfer" },
      { labelKey: "item_price_levels", icon: <BarChart2 size={14} />,   href: "/price-levels" },
      { labelKey: "item_wholesale",    icon: <Tag size={14} />,         href: "/wholesale" },
      { labelKey: "item_sku",          icon: <Barcode size={14} />,    href: "/sku" },
      { labelKey: "item_expiration",   icon: <AlertCircle size={14} />, href: "/expiration" },
    ],
  },
  {
    id: "promo", labelKey: "sec_promo", icon: <Percent size={14} />,
    items: [
      { labelKey: "item_promotions", icon: <Gift size={14} />,   href: "/promotions" },
      { labelKey: "item_discounts",  icon: <Ticket size={14} />, href: "/discounts" },
    ],
  },
  {
    id: "crm", labelKey: "sec_crm", icon: <UserCircle size={14} />,
    items: [
      { labelKey: "item_customers",       icon: <Users size={14} />,    href: "/customers" },
      { labelKey: "item_points_exchange", icon: <Award size={14} />,    href: "/points-exchange" },
      { labelKey: "item_points_settings", icon: <Settings size={14} />, href: "/points-settings" },
    ],
  },
  {
    id: "admin", labelKey: "sec_admin", icon: <Briefcase size={14} />,
    items: [
      { labelKey: "item_branches",      icon: <Store size={14} />,         href: "/branches" },
      { labelKey: "item_employees",     icon: <UserCog size={14} />,       href: "/employees" },
      { labelKey: "item_vendors",       icon: <Factory size={14} />,       href: "/vendors" },
      { labelKey: "item_pos_machines",  icon: <Monitor size={14} />,       href: "/pos-machines" },
      { labelKey: "item_activity",      icon: <CalendarRange size={14} />, href: "/activity" },
      { labelKey: "item_table_monitor", icon: <Monitor size={14} />,       href: "/table-monitor" },
      { labelKey: "item_devices",       icon: <Smartphone size={14} />,    href: "/devices" },
    ],
  },
  {
    id: "help", labelKey: "sec_help", icon: <HelpCircle size={14} />,
    items: [
      { labelKey: "item_manual",          icon: <BookOpen size={14} />,      href: "/manual" },
      { labelKey: "item_report_problem",  icon: <MessageCircle size={14} />, href: "/report-problem" },
      { labelKey: "item_payment_confirm", icon: <CardIcon size={14} />,      href: "/payment-confirm" },
      { labelKey: "item_package",         icon: <Package size={14} />,       href: "/package" },
      { labelKey: "item_hardware",        icon: <Cpu size={14} />,           href: "/hardware" },
      { labelKey: "item_partners",        icon: <HelpingHand size={14} />,   href: "/partners" },
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
  const { t } = useLanguage();
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

      </div>

      {/* ── Widget row (speedometer / favorites / apps / dropdown) ── */}
      <div className="flex items-center justify-around px-2 py-2 flex-shrink-0" style={{ background: "#172944" }}>
        <Link href="/dashboard" className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 36, height: 36, color: "#fff" }} title={t("item_dashboard")}>
          <Gauge size={20} strokeWidth={1.8} />
        </Link>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 36, height: 36, color: "#fff" }} title="Favorites">
          <Star size={20} strokeWidth={1.8} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 36, height: 36, color: "#fff" }} title="Apps">
          <LayoutGrid size={18} strokeWidth={1.8} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 36, height: 36, color: "#fff" }} title="More">
          <ChevronDown size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* ── Nav sections ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll">
        {NAV_SECTIONS.map(section => {
          const isOpen = open[section.id];
          return (
            <div key={section.id} style={{ background: S.menuItemsBg }}>
              {/* Section header — .sidebar-menu > li (with treeview) */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 text-left transition-colors"
                style={{
                  padding: "12px 10px 12px 15px",
                  fontSize: 14,
                  background: isOpen ? S.sectionOpenBg : S.menuItemsBg,
                  color: isOpen ? S.sectionOpenText : S.menuItemsText,
                  cursor: "pointer",
                }}
              >
                <span className="flex-shrink-0 w-[20px] flex items-center justify-center">{section.icon}</span>
                <span className="flex-1 font-semibold truncate">
                  {t(section.labelKey)}
                </span>
                <ChevronLeft
                  size={12}
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.5s ease",
                  }}
                />
              </button>

              {/* Sub-items — .treeview-menu */}
              {isOpen && (
                <ul>
                  {section.items.map(item => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 text-[13px] transition-colors group"
                          style={{
                            padding: "8px 10px 8px 20px",
                            display: "flex",
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
                          <span className="flex-shrink-0 w-[20px] flex items-center justify-center opacity-80">{item.icon}</span>
                          <span className="flex-1 truncate">{t(item.labelKey)}</span>
                          <Star
                            size={13}
                            className="flex-shrink-0 transition-opacity hover:opacity-100"
                            style={{ color: active ? "#fff" : S.subItemText, opacity: active ? 0.9 : 0.45 }}
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
