"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { LanguageCode, Dict } from "@/i18n/types";
import { th, lo, en } from "@/i18n";

const DICTS: Record<LanguageCode, Dict> = { th, lo, en };
const STORAGE_KEY = "pospos_lang";

interface LanguageCtx {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: keyof Dict) => string;
}

const LanguageContext = createContext<LanguageCtx>({
  lang: "th",
  setLang: () => {},
  t: (k) => String(k),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("th");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    // Update <html data-lang> so CSS font rules can target it
    document.documentElement.setAttribute("data-lang", l);
  }, []);

  // Sync data-lang on mount and lang changes
  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  const t = useCallback((key: keyof Dict): string => {
    return DICTS[lang][key] ?? DICTS["th"][key] ?? String(key);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslation() {
  const { t } = useContext(LanguageContext);
  return t;
}
