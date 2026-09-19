import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: { default: "Nuvecto — Make code click", template: "%s · Nuvecto" },
  description:
    "Learn programming with visual explanations, real code, and smart practice. Available in English and Polish.",
  openGraph: {
    title: "Nuvecto — Make code click",
    description: "Small lessons. Real code. A different future.",
    images: [
      {
        url: "/assets/knowledge-core.webp",
        width: 1400,
        height: 933,
      },
    ],
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};
const themeScript = `try{var t=localStorage.getItem('nuvecto.theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';}catch(e){document.documentElement.dataset.theme='dark';}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
