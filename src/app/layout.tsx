import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "GOPOSPOS",
  description: "Point of Sale System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="skin-blue">
      <head>
        {/* AdminLTE layout framework — cloned from go.pospos.co */}
        <link rel="stylesheet" href="/css/AdminLTE.min.css" />
        {/* skin-blue theme — cloned from go.pospos.co */}
        <link rel="stylesheet" href="/css/skin-blue.min.css" />
        {/* Full POSPOS custom styles — cloned from go.pospos.co/styles.css */}
        <link rel="stylesheet" href="/css/pospos-styles.css" />
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
