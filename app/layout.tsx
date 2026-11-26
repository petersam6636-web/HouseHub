import type { Metadata } from "next";
import ContextFile from "@/lib/ContextFile";

import "./globals.css";

export const metadata: Metadata = {
  title: "HouseHub",
  description: "Your home, thoughtfully connected.",
  icons: {
    icon: "/househub_logo.png",
    apple: "/househub_logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ContextFile>{children}</ContextFile>
      </body>
    </html>
  );
}

