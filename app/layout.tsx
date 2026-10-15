import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "ShopSphere AI",
  description: "AI-powered personalized shopping platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AIChat />
        </Providers>
      </body>
    </html>
  );
}
