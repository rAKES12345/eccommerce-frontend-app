import React, { createContext, useState } from "react";

export const SellerOperationsContext = createContext();

const baseUrl = 'https://ecommerce-0zde.onrender.com';

export const SellerOperationsProvider = ({ children }) => {
  // Here you can add your seller-specific states and methods
  const [someSellerState, setSomeSellerState] = useState(null);

  // Example value to share in context:
  const value = {
    someSellerState,
    setSomeSellerState,
    baseUrl,
    // add your methods here
  };

  return (
    <SellerOperationsContext.Provider value={value}>
      {children}
    </SellerOperationsContext.Provider>
  );
};
