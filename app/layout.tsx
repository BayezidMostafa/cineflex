"use client";

import Navbar from "@/components/common/Navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/common/Footer/Footer";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <Navbar />
            {children}
            <Footer />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
