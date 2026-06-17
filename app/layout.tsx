import type { Metadata } from "next";
import { Kiwi_Maru } from "next/font/google";
import "./globals.css";

const kiwiMaru = Kiwi_Maru({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-kiwi-maru",
});

export const metadata: Metadata = {
  title: "Burrow",
  description: "2人だけの秘密基地",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${kiwiMaru.variable} h-full`}>
      <body style={{ fontFamily: 'var(--font-kiwi-maru), serif', margin: 0 }} className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
