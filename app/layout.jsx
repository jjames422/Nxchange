import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NxChange",
  description: "A cryptocurrency exchange platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
