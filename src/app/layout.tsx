
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {title: "dashtools"};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`h-full min-h-screen ${inter.className} bg-gray-950 text-zinc-200`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
