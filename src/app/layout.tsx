import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aurex — The Future of Secure Transactions",
  description: "Apply in minutes. Pay anywhere in the world. Zero foreign fees, instant approvals. The premium payment card built for modern life.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Aurex — The Future of Secure Transactions",
    description: "Apply in minutes. Pay anywhere in the world. Zero foreign fees, instant approvals.",
    siteName: "Aurex",
    type: "website",
    images: [{ url: "/hero-graphic.png", width: 1200, height: 630, alt: "Aurex Premium Payment Card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurex — The Future of Secure Transactions",
    description: "Apply in minutes. Pay anywhere in the world. Zero foreign fees, instant approvals.",
    images: ["/hero-graphic.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
              <CookieBanner />
            </ToastProvider>
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
