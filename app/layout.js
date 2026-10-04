import "./globals.css";
import { Inter, Unbounded } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Atelier & Co. — Considered Jewellery",
  description: "Thoughtful jewellery for all the days that make a life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={[inter.variable, unbounded.variable, "flex min-h-full flex-col bg-background font-sans text-text"].join(" ")}>
        <LenisProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}

