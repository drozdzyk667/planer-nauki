"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { preferences } from "@/services/preferences";
export function LocaleEntry() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${preferences.locale()}/`);
  }, [router]);
  return null;
}
