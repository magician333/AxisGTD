import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/poppins";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

// const inter = Inter({ subsets: ["latin"] });

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
    images: "https://www.axisgtd.work/logo.png",
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
      <body >
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
