import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "./provider"
import SessionProviders from "./sessionProvider";
import { userSession } from "@/libs/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime Chat",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await userSession()
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <SessionProviders session={session}>
          <Provider>
            {children}
          </Provider>
        </SessionProviders>
      </body>
    </html>
  );
}
