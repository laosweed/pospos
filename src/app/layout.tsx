import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "GOPOSPOS",
  description: "Point of Sale System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="skin-blue">
      <head>
        {/* Noto Sans Lao — for Lao language support */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@100;300;400;500;600;700;800&display=swap" />
        {/* AdminLTE layout framework — cloned from go.pospos.co */}
        <link rel="stylesheet" href="/css/AdminLTE.min.css" />
        {/* skin-blue theme — cloned from go.pospos.co */}
        <link rel="stylesheet" href="/css/skin-blue.min.css" />
        {/* Full POSPOS custom styles — cloned from go.pospos.co/styles.css */}
        <link rel="stylesheet" href="/css/pospos-styles.css" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
