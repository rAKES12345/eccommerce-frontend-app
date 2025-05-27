"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DelivererSidebar from "@/Components/DelivererSidebar";
import SellerSidebar from "@/Components/SellerSidebar";
import SellerNavbar from "@/Components/SellerNavbar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Import AuthProvider and useAuth correctly depending on your AuthContext setup
import AuthProvider, { useAuth } from "./AuthContext"; // <== default export + named export

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

function ClientWrapper({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || user === undefined) return null;

  const role = user?.role;
  const showDefaultNavbar = !role || role === "user";
  const isSeller = role === "seller";
  const isDeliverer = role === "deliverer";

  return (
    <>
      {showDefaultNavbar && <Navbar />}
      {isSeller && <SellerNavbar />}
      {isDeliverer && <SellerNavbar />} {/* Replace with DelivererNavbar if available */}

      <div className="d-flex">
        {isSeller && <SellerSidebar />}
        {isDeliverer && <DelivererSidebar />}
        <div className="flex-grow-1 w-100">
          <div className="">{children}</div>
        </div>
      </div>

      <Footer />
    </>
  );
}
