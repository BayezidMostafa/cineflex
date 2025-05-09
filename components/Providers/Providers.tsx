// app/providers.tsx
"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import Modal from "@/components/common/Modal/Modal";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" />
          <Navbar />
          <div className="max-w-7xl mx-auto px-3 sm:px-5 pt-20">{children}</div>
          <Footer />
          <Modal />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
