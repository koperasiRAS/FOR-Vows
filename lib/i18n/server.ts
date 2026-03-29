import { cookies } from "next/headers";
import { type Language } from "@/lib/i18n/translations";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("forvows_lang")?.value;
  if (lang === "id" || lang === "en") return lang;
  return "id";
}
