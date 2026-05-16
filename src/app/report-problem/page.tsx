"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { MessageCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export default function ReportProblemPage() {
  const t = useTranslation();

  const CATEGORIES = [
    t("item_sell"), t("item_stock"), t("settings_printer"),
    "ปัญหาการเข้าสู่ระบบ", "ปัญหาการชำระเงิน", "อื่นๆ",
  ];

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!subject || !detail) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageShell>
        <div className="p-5 flex flex-col items-center justify-center min-h-96 gap-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-500"/>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t("report_success_title")}</h2>
          <p className="text-slate-500 text-center max-w-sm">{t("report_success_desc")}</p>
          <button onClick={()=>{setSubmitted(false);setSubject("");setDetail("");}}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
            {t("report_another")}
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="p-5 max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <MessageCircle size={20} className="text-blue-600"/>
          </div>
          <h1 className="text-xl font-bold text-slate-800">{t("report_title")}</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("report_category_label")}</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={()=>setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${category===c?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("report_subject_label")}</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder={t("report_subject_placeholder")}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("report_detail_label")}</label>
            <textarea value={detail} onChange={e=>setDetail(e.target.value)} rows={5}
              placeholder={t("report_detail_placeholder")}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("report_screenshot_label")}</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 cursor-pointer hover:border-blue-300 hover:text-blue-400 transition-colors">
              <p className="text-sm">คลิกหรือลากไฟล์มาวางที่นี่</p>
              <p className="text-[11px] mt-1">PNG, JPG ขนาดไม่เกิน 5MB</p>
            </div>
          </div>
          <button onClick={submit} disabled={!subject||!detail}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40">
            {t("report_submit")}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
