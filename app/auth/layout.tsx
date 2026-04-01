import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/context";
import { TemplateProvider } from "@/lib/template-context";

export const metadata: Metadata = {
  title: {
    default: "Account | FOR Vows",
    template: "%s | FOR Vows",
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <TemplateProvider>{children}</TemplateProvider>
    </LanguageProvider>
  );
}
