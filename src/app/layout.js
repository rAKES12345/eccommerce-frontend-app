'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthContext";
import DelivererSidebar from "@/Components/DelivererSidebar";
import SellerSidebar from "@/Components/SellerSidebar";
import { useEffect, useState } from "react";
import SellerNavbar from "@/Components/SellerNavbar";
import Navbar from "@/Components/Navbar";
import BNavbar from "@/Components/BNavbar";
import Footer from "@/Components/Footer";
import CartNavbar from "@/Components/CartNavbar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [role, setRole] = useState(null);
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const isCartPage = pathname === "/cart";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {role === null && <BNavbar />}
          {role === "user" && !isCartPage && <Navbar />}
          {role === "user" && isCartPage && <CartNavbar />}
          {(role === "seller" || role === "deliverer") && <SellerNavbar />}

          <div className="d-flex">
            {role === "seller" && <SellerSidebar />}
            {role === "deliverer" && <DelivererSidebar />}
            <div className="flex-grow-1 w-100">{children}</div>
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
