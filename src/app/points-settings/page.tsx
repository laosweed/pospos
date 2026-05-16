"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Award } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "@/context/LanguageContext";

export default function PointsSettingsPage() {
  const t = useTranslation();
  const [enabled, setEnabled] = useState(true);
  const [earnRate, setEarnRate] = useState("1");
  const [earnEvery, setEarnEvery] = useState("10");
  const [expiry, setExpiry] = useState("365");
  const [minRedeem, setMinRedeem] = useState("100");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <PageShell>
      <div className="p-5 max-w-2xl space-y-5">
        <h1 className="text-xl font-bold text-slate-800">{t("pts_title")}</h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{t("pts_enable")}</p>
              <p className="text-[12px] text-slate-400">{t("pts_enable_desc")}</p>
            </div>
            <button onClick={()=>setEnabled(v=>!v)}
              className={clsx("w-12 h-7 rounded-full relative transition-colors", enabled?"bg-blue-500":"bg-slate-300")}>
              <div className={clsx("absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all", enabled?"left-6":"left-1")}/>
            </button>
          </div>

          <div className="border-t pt-5 space-y-4">
            <h3 className="font-medium text-slate-700">{t("pts_earn_section")}</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("pts_earn_every")}</label>
                <input type="number" value={earnEvery} onChange={e=>setEarnEvery(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <span className="text-slate-400 mt-5 flex-shrink-0">{t("pts_earn_gets")}</span>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("pts_earn_label")}</label>
                <input type="number" value={earnRate} onChange={e=>setEarnRate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
              <Award size={16} className="text-amber-500"/>
              <span className="text-amber-700">{t("pts_earn_every").replace("(฿)","").replace("(₭)","")} {earnEvery} ฿ {t("pts_earn_gets")} {earnRate} {t("pts_earn_label")}</span>
            </div>
          </div>

          <div className="border-t pt-5 space-y-4">
            <h3 className="font-medium text-slate-700">{t("pts_redeem_section")}</h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("pts_min_redeem")}</label>
              <input type="number" value={minRedeem} onChange={e=>setMinRedeem(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("pts_expiry_label")}</label>
              <input type="number" value={expiry} onChange={e=>setExpiry(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
          </div>

          <button onClick={save} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
            {saved ? t("pts_saved") : t("pts_save")}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
