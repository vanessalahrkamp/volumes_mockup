import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://volumes.cloud"),
  title: "Volumes — Data for Physical AI",
  description: "Volumes buys and sells data for physical AI.",
  openGraph: {
    title: "Volumes — Data for Physical AI",
    description: "Volumes buys and sells data for physical AI.",
    url: "https://volumes.cloud",
    siteName: "Volumes",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} h-dvh overflow-hidden antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-ground text-ink-primary overscroll-none">
        {children}
      </body>
    </html>
  );
}
