import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maddox Training OS",
  description: "Private youth hockey training planner and live session app.",
  applicationName: "Maddox Training OS",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  appleWebApp: {
    capable: true,
    title: "Maddox Training",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10283b",
};

const nav = [
  { href: "/today", label: "Today" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kpis", label: "KPIs" },
  { href: "/exports", label: "Exports" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-rink bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-black tracking-tight text-navy">
              MADDOX <span className="text-blue">TRAINING OS</span>
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-sm font-bold hover:bg-ice">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:pb-8">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-rink bg-white p-2 sm:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-1 py-3 text-center text-xs font-bold hover:bg-ice">
              {item.label}
            </Link>
          ))}
        </nav>
      </body>
    </html>
  );
}
