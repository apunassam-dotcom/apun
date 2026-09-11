import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APUN | Association for People's Upliftment and Nurturing",
  description: "APUN is a community-based non-profit organization dedicated to inclusive social development, humanitarian action, and grassroots empowerment in Dibrugarh, Assam. Registered under the Societies Registration Act, 1860.",
  keywords: ["APUN", "Assam", "NGO", "Community Development", "Dibrugarh", "Grassroots", "Empowerment"],
  authors: [{ name: "APUN Association" }],
  openGraph: {
    title: "APUN | Empowering Communities in Assam",
    description: "Building resilient communities through grassroots empowerment in Dibrugarh, Assam.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
