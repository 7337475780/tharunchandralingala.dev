import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { NoiseBackground } from "@/components/NoiseBackground";
import { Preloader } from "@/components/Preloader";
import { AdminShortcut } from "@/components/AdminShortcut";
import SmoothScroll from "@/components/SmoothScroll";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tharunchandralingala.dev"),
  title: "Tharun Chandra Lingala | Full Stack Developer — React, Next.js, TypeScript",
  description: "Frontend-focused Full Stack Developer from Andhra Pradesh, India. Building real-time apps, AI-powered platforms and scalable UIs. Open to full-time roles.",
  keywords: ["Full Stack Developer Andhra Pradesh", "React Developer India", "Next.js Developer", "TypeScript Developer", "Tharun Chandra Lingala"],
  alternates: {
    canonical: "https://tharunchandralingala.dev",
  },
  openGraph: {
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharun Chandra Lingala - Full Stack Developer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else if (stored === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased selection:bg-accent/30 selection:text-text-main`}>
        <ThemeProvider>
          <NoiseBackground />
          <CustomCursor />
          <AdminShortcut />
          <Preloader />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
