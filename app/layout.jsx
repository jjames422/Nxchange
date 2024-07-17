import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextUIProvider } from '@nextui-org/react';
import CustomNavbar from '@/components/navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NxChange",
  description: "A cryptocurrency exchange platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NextUIProvider>
          <CustomNavbar />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
