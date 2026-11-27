import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ContextFile from "@/lib/ContextFile";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HouseHub",
  description: "Your home, thoughtfully connected.",
  icons: {
    icon: "/househub_logo.png",
    apple: "/househub_logo.png",
  },
  themeColor: "#05070D",
};

export const viewport: Viewport = {
  themeColor: "#05070D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ContextFile>{children}</ContextFile>
      </body>
    </html>
  );
}

