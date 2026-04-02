"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthHeader() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!loggedIn) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2 px-3 py-1.5
          text-[11px] tracking-widest uppercase font-label
          text-stone-400 hover:text-red-500
          border border-outline-variant/30 hover:border-red-400/40
          rounded-full transition-all
        "
      >
        <LogOut size={12} strokeWidth={1.5} />
        Log Out
      </button>
    </div>
  );
}
