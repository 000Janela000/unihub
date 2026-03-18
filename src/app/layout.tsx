import type { Metadata, Viewport } from "next";
import { Noto_Sans, Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UniSchedule",
  description: "University schedule & exam tracker for Agricultural University of Georgia",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${notoSans.variable} antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="pt-14 pb-20">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}

// Next.js App Router requires a default export for layouts
export default RootLayout;
