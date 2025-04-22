// app/layout.tsx
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers/Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Cineflex",
  description:
    "Cineflex: Your ultimate destination for cinematic insights and entertainment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`antialiased font-sans ${montserrat.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
