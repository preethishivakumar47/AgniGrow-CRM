import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgniGrow CRM — Sales Pipeline & Operating System",
  description: "Enterprise Sales Pipeline and Customer Operating System for AgniGrow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="bg-[#080b11] text-[#f8fafc] min-h-screen selection:bg-orange-500/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
