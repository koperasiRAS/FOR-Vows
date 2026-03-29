"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Language } from "@/lib/i18n/translations";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<(typeof translations)["id"]>;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "forvows_lang";
const COOKIE_NAME = "forvows_lang";

function readCookie(name: string): Language | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2] as Language;
  return null;
}

function writeCookie(name: string, value: Language) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prefer localStorage, fall back to cookie
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    const cookieVal = readCookie(COOKIE_NAME);
    if (stored === "id" || stored === "en") {
      setLangState(stored);
      writeCookie(COOKIE_NAME, stored);
    } else if (cookieVal === "id" || cookieVal === "en") {
      setLangState(cookieVal);
    }
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    writeCookie(COOKIE_NAME, newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = "ltr";
  }, []);

  // Sync lang attribute on mount
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
    }
  }, [lang, mounted]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[lang] as Record<string, unknown>;
      let value = getNestedValue(dict, key);

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }

      return value;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
