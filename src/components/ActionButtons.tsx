"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";

interface ActionBtn {
  labelKey: string;
  borderColor: string;
  activeBg: string;
  href: string;
}

const BUTTONS: ActionBtn[] = [
  { labelKey: "action_sell",     borderColor: "rgb(57,162,235)",  activeBg: "rgb(214,235,250)", href: "/sell" },
  { labelKey: "item_buy",        borderColor: "rgb(154,80,255)",  activeBg: "rgb(234,219,255)", href: "/buy" },
  { labelKey: "item_stock",      borderColor: "rgb(245,100,134)", activeBg: "rgb(253,222,229)", href: "/stock" },
  { labelKey: "item_reports",    borderColor: "rgb(149,202,59)",  activeBg: "rgb(228,242,205)", href: "/reports" },
  { labelKey: "item_customers",  borderColor: "rgb(250,206,87)",  activeBg: "rgb(254,239,205)", href: "/customers" },
  { labelKey: "dash_import",     borderColor: "rgb(66,193,218)",  activeBg: "rgb(207,237,243)", href: "/import-buy" },
  { labelKey: "item_documents",  borderColor: "rgb(59,116,202)",  activeBg: "rgb(211,224,243)", href: "/documents" },
  { labelKey: "item_activity",   borderColor: "rgb(222,179,173)", activeBg: "rgb(245,232,229)", href: "/activity" },
];

export default function ActionButtons() {
  const t = useTranslation();
  const pathname = usePathname();

  const onDashboard = pathname === "/dashboard" || pathname === "/";

  return (
    <div className="grid grid-cols-8 gap-2.5 px-4 py-3">
      {BUTTONS.map((btn) => {
        const isActive =
          pathname === btn.href ||
          pathname.startsWith(btn.href + "/") ||
          (onDashboard && btn.href === "/sell");
        return (
          <Link
            key={btn.labelKey}
            href={btn.href}
            className={clsx(
              "flex items-center justify-center rounded-[10px] transition-all duration-150 text-center",
              "hover:-translate-y-0.5"
            )}
            style={{
              borderBottom: `8px solid ${btn.borderColor}`,
              background: isActive ? btn.activeBg : "#fff",
              boxShadow: "rgba(0, 0, 0, 0.18) 0px 0px 8px 2px",
              minHeight: 90,
              textDecoration: "none",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = btn.activeBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? btn.activeBg : "#fff"; }}
          >
            <span className="text-[22px] font-bold text-slate-800 leading-none">
              {t(btn.labelKey as Parameters<typeof t>[0])}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
