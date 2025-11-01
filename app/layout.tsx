import Header from "@/components/Header"
import type { Metadata } from "next";
import { geistMono, geistSans } from "@/fonts";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "Money Tips Financial Advisor",
  description: "An AI financial chat based advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
