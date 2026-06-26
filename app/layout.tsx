import type { Metadata } from "next";
import { Open_Sans, Oswald, Geist_Mono } from "next/font/google";
import "./globals.css";

// Body: Open Sans — Texas A&M's official brand typeface for body copy.
const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings: Oswald — Texas A&M's official condensed display typeface for
// headlines and titles.
const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aggie Engineering Matcher",
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
      className={`${openSans.variable} ${oswald.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
