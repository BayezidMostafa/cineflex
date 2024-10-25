// app/layout.tsx
"use client";

import Navbar from "@/components/common/Navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/common/Footer/Footer";
import { Montserrat } from "next/font/google";

// Configure Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose weights based on your needs
  variable: "--font-montserrat", // CSS variable to use in the project
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}> {/* Add the font class */}
      <body className={`antialiased font-sans ${montserrat.className}`}> {/* Apply Montserrat */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <div className="max-w-7xl mx-auto px-3 sm:px-5 pt-20">
              {children}
            </div>
            <Footer />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
