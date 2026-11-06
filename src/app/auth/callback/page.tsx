"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/connectors/supabase";
import { isAdminEmail } from "@/lib/auth/config";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Completing sign-in…");

  useEffect(() => {
    const run = async () => {
      const sb = getSupabaseBrowser();
      if (!sb) {
        setMsg("Supabase not configured");
        return;
      }
      const { data, error } = await sb.auth.getSession();
      if (error) {
        setMsg(error.message);
        return;
      }
      const email = data.session?.user?.email;
      if (isAdminEmail(email)) router.replace("/admin");
      else router.replace("/account");
    };
    run();
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-violet-300 text-sm">{msg}</div>
  );
}
