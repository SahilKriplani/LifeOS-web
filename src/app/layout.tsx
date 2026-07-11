import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import ToasterProvider from "@/components/shared/ToasterProvider";
import "./globals.css";
import QueryProvider from "@/components/shared/QueryProvider";
import GoogleProvider from "@/components/shared/GoogleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LifeOS — Your personal life operating system",
    template: "%s · LifeOS",
  },
  description:
    "Track goals, fitness, DSA practice, and daily plans in one focused dashboard. LifeOS is your personal life operating system.",
  applicationName: "LifeOS",
  openGraph: {
    title: "LifeOS — Your personal life operating system",
    description:
      "Track goals, fitness, DSA practice, and daily plans in one focused dashboard.",
    siteName: "LifeOS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ToasterProvider />
          <GoogleProvider>
            <QueryProvider>{children}</QueryProvider>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
