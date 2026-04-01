import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/context";
import { TemplateProvider } from "@/lib/template-context";
import { AdminLogoutButton } from "@/components/admin/LogoutButton";

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
        <div className="min-h-screen bg-[#faf9f8]">
          <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex h-14 items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <span className="font-serif italic font-semibold text-sm text-[#735c00] tracking-tight">
                  FOR Vows
                </span>
                <span className="text-[10px] text-stone-400 border rounded px-1.5 py-0.5 tracking-wide">
                  Admin
                </span>
              </div>
              <AdminLogoutButton />
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </TemplateProvider>
    </LanguageProvider>
  );
}
