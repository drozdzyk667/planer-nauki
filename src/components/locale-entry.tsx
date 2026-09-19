"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { preferences } from "@/services/preferences";

export function LocaleEntry() {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    router.replace(`/${preferences.locale()}/`, { scroll: true });
  }, [router]);
  return null;
}
