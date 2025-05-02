import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { Toaster } from "@/components/ui/toaster";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <div className="flex-1 w-full flex flex-col gap-8">
              <nav className="w-full border-b border-b-foreground/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center h-auto md:h-16 px-4 md:px-8 py-3 gap-4">
                  <div className="flex gap-4 items-center font-semibold text-base md:text-sm">
                    <Link href={"/"}>Campaigns</Link>
                  </div>
                  <div className="flex-shrink-0">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 w-full">
                {children}
              </div>

              {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-4">
               Footer içerikleri
            </footer> */}
            </div>
          </main>
        </ThemeProvider>
      </body>
      <Toaster />
    </html>
  );
}
