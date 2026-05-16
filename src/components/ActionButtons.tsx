"use client";

import Link from "next/link";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";

interface ActionBtn {
  labelKey: string;
  hotkey: string;
  borderColor: string;
  activeBg?: string;
  href: string;
}

const BUTTONS: ActionBtn[] = [
  { labelKey: "item_sell",       hotkey: "F1", borderColor: "rgb(57,162,235)",   href: "/sell" },
  { labelKey: "item_buy",        hotkey: "F2", borderColor: "rgb(154,80,255)",   activeBg: "rgb(234,219,255)", href: "/buy" },
  { labelKey: "item_stock",      hotkey: "F3", borderColor: "rgb(245,100,134)",  href: "/stock" },
  { labelKey: "item_reports",    hotkey: "F4", borderColor: "rgb(149,202,59)",   href: "/reports" },
  { labelKey: "item_customers",  hotkey: "F5", borderColor: "rgb(250,206,87)",   href: "/customers" },
  { labelKey: "dash_import",     hotkey: "F6", borderColor: "rgb(66,193,218)",   href: "/import-buy" },
  { labelKey: "item_documents",  hotkey: "F7", borderColor: "rgb(59,116,202)",   href: "/documents" },
  { labelKey: "item_activity",   hotkey: "F8", borderColor: "rgb(222,179,173)",  href: "/activity" },
];

export default function ActionButtons() {
  const t = useTranslation();

  return (
    <div className="grid grid-cols-8 gap-2 bg-white px-4 py-3">
      {BUTTONS.map((btn) => (
        <Link
          key={btn.labelKey}
          href={btn.href}
          className={clsx(
            "flex flex-col items-center justify-center gap-1 rounded-lg py-3.5 px-2",
            "border border-slate-100 transition-all duration-150 text-center",
            "hover:-translate-y-0.5 hover:shadow-md"
          )}
          style={{
            borderBottomWidth: 7,
            borderBottomStyle: "solid",
            borderBottomColor: btn.borderColor,
            background: "#fff",
            textDecoration: "none",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = btn.activeBg ?? "#f8fafc";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "#fff";
          }}
        >
          <span className="text-sm font-semibold text-slate-800">{t(btn.labelKey as Parameters<typeof t>[0])}</span>
          <span className="text-[10px] text-slate-400">{btn.hotkey}</span>
        </Link>
      ))}
    </div>
  );
}
