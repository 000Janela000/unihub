import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body className={`${notoSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="pt-14 pb-20 min-h-screen">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
