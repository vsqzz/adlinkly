import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";

export const metadata: Metadata = {
  title: "Adlinkly - Monetized links for modern creators",
  description:
    "Adlinkly helps creators earn from short links with premium boosts, anti-bypass protection, analytics, payouts, and affiliate programs.",
  metadataBase: new URL("https://adlinkly.net")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
