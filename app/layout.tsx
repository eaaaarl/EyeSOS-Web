
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EyeSOS",
  description: "EyeSOS is a platform for emergency response and disaster management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="grammarly" content="false" />
        <meta name="grammarly-extension" content="false" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased font-poppins`}
        suppressHydrationWarning
      >
        <Providers>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
