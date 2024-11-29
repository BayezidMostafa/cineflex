// app/layout.tsx
"use client";

import Navbar from "@/components/common/Navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/common/Footer/Footer";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Modal from "@/components/common/Modal/Modal";
import { ClerkProvider } from "@clerk/nextjs";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={montserrat.variable}>
        <head>
          <title>Cineflex</title>
          <meta
            name="description"
            content="Cineflex: Your ultimate destination for cinematic insights and entertainment."
          />
        </head>
        <body className={`antialiased font-sans ${montserrat.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <Toaster position="top-center" />
              <Navbar />
              <div className="max-w-7xl mx-auto px-3 sm:px-5 pt-20">
                {children}
              </div>
              <Footer />
              <Modal />
            </QueryClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
