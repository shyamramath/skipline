import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import { Providers } from "./providers";
import { APP_CONFIG } from "./config/app.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          {/* Background image with opacity */}
          <div
            className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                `url('${process.env.NEXT_PUBLIC_BASE_PATH}/cartoon-drawing-neighborhood-with-houses-background.avif')`,
            }}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
