"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Store, Printer, Bell, Shield, CreditCard, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { supabase, STORE_ID } from "@/lib/supabase/browser";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/context/LanguageContext";

export default function SettingsPage() {
  const t = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("store");
  const [storeName, setStoreName] = useState("");
  const [posName, setPosName] = useState("");
  const [vatEnabled, setVatEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const SECTIONS = [
    { id:"store",    icon:Store,      label: t("settings_store_info"),       desc: t("settings_store_info_desc") },
    { id:"printer",  icon:Printer,    label: t("settings_printer"),          desc: t("settings_printer_desc") },
    { id:"payment",  icon:CreditCard, label: t("settings_payment_methods"),  desc: t("settings_payment_methods_desc") },
    { id:"notif",    icon:Bell,       label: t("settings_notifications"),    desc: t("settings_notifications_desc") },
    { id:"security", icon:Shield,     label: t("settings_security"),         desc: t("settings_security_desc") },
  ];

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("stores").select("*").eq("id", STORE_ID).single();
      if (data) {
        const d = data as any;
        setStoreName(d.name);
        setPosName(d.pos_name);
        setVatEnabled(d.vat_enabled);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await (supabase.from("stores") as any)
      .update({ name: storeName, pos_name: posName, vat_enabled: vatEnabled })
      .eq("id", STORE_ID);
    if (error) {
      toast.error(t("common_error"));
    } else {
      toast.success(t("common_success"));
    }
    setSaving(false);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex" style={{ marginTop: 50 }}>
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 min-h-[calc(100vh-50px)] overflow-auto" style={{ marginLeft: sidebarOpen ? 200 : 0, background: "#edf1f5" }}>
          <div className="p-5">
            <h1 className="text-xl font-bold text-slate-800 mb-5">{t("settings_title")}</h1>

            <div className="flex gap-5">
              <div className="w-56 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {SECTIONS.map(s => {
                    const Icon = s.icon;
                    return (
                      <button key={s.id} onClick={() => setActive(s.id)}
                        className={clsx("w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-slate-50 last:border-0 transition-colors",
                          active===s.id?"bg-blue-50":"hover:bg-slate-50")}>
                        <Icon size={16} className={active===s.id?"text-blue-600":"text-slate-400"} />
                        <span className={clsx("text-[13px] font-medium", active===s.id?"text-blue-600":"text-slate-700")}>{s.label}</span>
                        <ChevronRight size={12} className="ml-auto text-slate-300" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1">
                {active === "store" && (
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                    <h2 className="font-semibold text-slate-800 text-lg">{t("settings_store_info")}</h2>
                    {loading ? (
                      <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"/></div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1.5">{t("col_name")}</label>
                          <input value={storeName} onChange={e=>setStoreName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1.5">{t("item_pos_machines")}</label>
                          <input value={posName} onChange={e=>setPosName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-slate-700">VAT</p>
                            <p className="text-[12px] text-slate-400">{t("settings_payment_methods_desc")}</p>
                          </div>
                          <button onClick={() => setVatEnabled(v=>!v)}
                            className={clsx("w-11 h-6 rounded-full relative transition-colors", vatEnabled?"bg-blue-500":"bg-slate-300")}>
                            <div className={clsx("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", vatEnabled?"left-5":"left-0.5")} />
                          </button>
                        </div>
                        <button onClick={handleSave} disabled={saving}
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                          {saving ? t("common_saving") : t("common_save")}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {(active==="printer"||active==="payment"||active==="notif"||active==="security") && (
                  <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-64 text-slate-400">
                    <p className="text-4xl mb-3">⚙️</p>
                    <p className="font-medium text-slate-600">{SECTIONS.find(s=>s.id===active)?.label}</p>
                    <p className="text-sm mt-1">{t("common_loading")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
