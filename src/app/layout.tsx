import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import SessionProvider from "./SessionProvider";
import BackBotton from "./BackButton/BackBottonn";
import WhatsappIcon from "./components/Whatsapp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIDU",
  description: "Focus Inspired Determined Undefeated",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className=" mt-16 p-4 max-w-7xl m-auto min-w-[300px]">
            <BackBotton/>
            {children}
          </main>
          <Footer />
          <WhatsappIcon />
        </SessionProvider>
      </body>
    </html>
  );
}
