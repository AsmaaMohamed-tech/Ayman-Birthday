import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Ayman | A Cinematic Experience",
  description: "A cinematic, scroll-driven birthday experience crafted with love for Ayman.",
  openGraph: {
    title: "Happy Birthday Ayman",
    description: "A cinematic birthday experience.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0a0a0a] text-[#f0ede8] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
