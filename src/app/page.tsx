import { Providers } from "@/components/providers";
import { AppShell } from "@/components/shell";
import { Landing } from "@/components/landing";
import { LocaleEntry } from "@/components/locale-entry";
export default function Home() {
  return (
    <Providers locale="en" persistLocale={false}>
      <LocaleEntry />
      <AppShell>
        <Landing />
      </AppShell>
    </Providers>
  );
}
