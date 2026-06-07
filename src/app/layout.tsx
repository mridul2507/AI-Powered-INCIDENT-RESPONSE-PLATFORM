import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"
import PageTransition from "@/components/PageTransition";
import ThemeProvider from "@/components/ThemeProvider";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IR Assist",
  description: "AI-powered Incident Response Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <Providers>
          <ThemeProvider>
            <div className="flex min-h-screen bg-white dark:bg-emerald-950">

              <Sidebar />

              <main className="flex-1 bg-white dark:bg-emerald-950">
                <PageTransition>{children}</PageTransition>
              </main>

            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
