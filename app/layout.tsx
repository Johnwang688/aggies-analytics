import type { Metadata } from "next";
import { Hanken_Grotesk, Oswald, Geist_Mono } from "next/font/google";
import "./globals.css";

// Body: a clean grotesque close to Texas A&M's brand typeface (Geograph).
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings: condensed collegiate display, evoking the Aggie maroon banners.
const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aggie Major Matcher",
  description:
    "Find the Texas A&M engineering major that best fits your skills, interests, and goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${oswald.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
