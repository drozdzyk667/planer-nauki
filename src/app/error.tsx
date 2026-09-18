"use client";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/lib/i18n";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const path = usePathname();
  const t = dictionaries[path.includes("/pl/") ? "pl" : "en"];
  return (
    <main className="container empty-state">
      <h1>{t.errorTitle}</h1>
      <p>{t.errorCopy}</p>
      <button className="button primary" onClick={reset}>
        {t.reload}
      </button>
    </main>
  );
}
