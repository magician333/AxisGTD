import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/poppins";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "AxisGTD",
  description: "AxisGTD is Todo list management tool for office workers personal use.",
  keywords: ["AxisGTD", "Todo", "GTD", "axis", "work", "office", "tools", "todolist", "task"],
  icons: { icon: "/icon.svg", shortcut: "/icon.png", apple: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.axisgtd.work",
    title: "AxisGTD",
    images: "https://www.axisgtd.work/icon.png",
    description: "AxisGTD is Todo list management tool for office workers personal use.",
    siteName: "AxisGTD",
  },
  twitter: {
    card: "summary_large_image",
    title: "AxisGTD",
    description: "AxisGTD is Todo list management tool for office workers personal use.",
    images: "https://www.axisgtd.work/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>

  );
}
