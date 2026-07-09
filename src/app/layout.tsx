import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SessionProvider } from "@/context/SessionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicPulse - Public Service Workflow Platform",
  description: "A comprehensive platform for citizens to report issues and government agencies to manage public service requests efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <SessionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <div className="fixed top-20 right-4 z-50">
              <ThemeToggle />
            </div>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
