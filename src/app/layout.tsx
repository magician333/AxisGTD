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
  title: "Axis GTD",
  description: "Axis GoToDo List",
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
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>

  );
}
