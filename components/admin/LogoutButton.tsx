"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Dynamic import to keep Supabase client out of server bundle
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-stone-500 hover:text-stone-800 transition-colors px-3 py-1.5 rounded hover:bg-stone-100"
    >
      Keluar
    </button>
  );
}
