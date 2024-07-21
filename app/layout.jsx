import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextUIProvider } from '@nextui-org/react';
import ClientWrapper from "@/components/ClientWrapper";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NxChange",
  description: "A cryptocurrency exchange platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          <NextUIProvider>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </NextUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
