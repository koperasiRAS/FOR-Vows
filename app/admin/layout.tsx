import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/context";
import { TemplateProvider } from "@/lib/template-context";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal | FOR Vows",
    template: "%s | FOR Vows Admin",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <TemplateProvider>
        <AdminShell>{children}</AdminShell>
      </TemplateProvider>
    </LanguageProvider>
  );
}
