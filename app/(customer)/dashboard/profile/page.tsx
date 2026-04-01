import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profil Saya | FOR Vows",
  description:
    "Kelola informasi profil dan kode referral Anda di FOR Vows.",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  );
}
