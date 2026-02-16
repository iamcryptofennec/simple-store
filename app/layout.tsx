import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers";
import { ProductsLayoutClient } from "@/components/products-layout-client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LING STORE",
  description: "Simple store",
};

interface RootLayoutProps {
  children: React.ReactNode;
  products: React.ReactNode;
}

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ProductsLayoutClient
            productsSlot={props.products}
          >
            {props.children}
          </ProductsLayoutClient>
        </QueryProvider>
      </body>
    </html>
  );
}
