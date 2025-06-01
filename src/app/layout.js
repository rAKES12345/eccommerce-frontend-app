'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import DelivererSidebar from '@/Components/DelivererSidebar';
import SellerSidebar from '@/Components/SellerSidebar';
import SellerNavbar from '@/Components/SellerNavbar';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserOperationsProvider } from '@/context/UserOperationsContext';
import { SellerOperationsProvider } from '@/context/SellerOperationsContext';
import { SellerAuthProvider, useSellerAuth } from '@/context/SellerAuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <SellerAuthProvider>
            <UserOperationsProvider>
              <SellerOperationsProvider>
                <ClientWrapper>{children}</ClientWrapper>
              </SellerOperationsProvider>
            </UserOperationsProvider>
          </SellerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function ClientWrapper({ children }) {
  const { user } = useAuth();
  const { seller, isLoaded: isSellerLoaded } = useSellerAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wait for hydration and seller context initialization
  if (!isMounted || !isSellerLoaded) return null;

  console.log("seller",seller)
  const sellerRole = seller?.role?.toLowerCase();
  const userRole = user?.role?.toLowerCase();

  const isSeller = sellerRole === 'seller';
  const isDeliverer = userRole === 'deliverer';
  const isUser = !userRole || userRole === 'user';

  return (
    <>
      {isSeller ? (
        <SellerNavbar />
      ) : isDeliverer ? (
        <SellerNavbar /> 
      ) : (
        <Navbar />
      )}

      <div className="d-flex">
        {isSeller && <SellerSidebar />}
        {isDeliverer && <DelivererSidebar />}
        <div className="flex-grow-1 w-100">{children}</div>
      </div>

      <Footer />
    </>
  );
}
