import { TanstackQueryProvider } from "@/lib/tanstack-query";
import { ThirdwebProvider } from "@/lib/thirdweb";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackQueryProvider>
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
