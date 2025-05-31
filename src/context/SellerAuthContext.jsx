'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const SellerAuthContext = createContext();

const baseUrl = 'https://ecommerce-0zde.onrender.com';

export const SellerAuthProvider = ({ children }) => {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get('sellerToken');
    const savedSeller = Cookies.get('sellerUser');
    if (savedToken && savedSeller) {
      setToken(savedToken);
      try {
        setSeller(JSON.parse(savedSeller));
      } catch (e) {
        console.warn("Failed to parse seller cookie:", e);
      }
    }
  }, []);

  const loginSeller = async (name, password) => {
    try {
      const res = await axios.post(`${baseUrl}/seller/login`, { name, password });
      const { token, seller } = res.data;

      Cookies.set('sellerToken', token, { expires: 7 });
      Cookies.set('sellerUser', JSON.stringify(seller), { expires: 7 });

      setToken(token);
      setSeller(seller);
      router.push('/seller/home');
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const registerSeller = async (name, email, password) => {
    try {
      const res = await axios.post(`${baseUrl}/seller/register`, { name, email, password });
      router.push('/seller/login');
      return res.data.message || 'Seller registration successful!';
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  };

  const getSellerDetails = async (name) => {
    try {
      const res = await axios.post(`${baseUrl}/seller/getsellerdetailsbyname`, { name });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };

  const logoutSeller = () => {
    Cookies.remove('sellerToken');
    Cookies.remove('sellerUser');
    setSeller(null);
    setToken(null);
    router.push('/');
  };

  return (
    <SellerAuthContext.Provider
      value={{
        seller,
        token,
        loginSeller,
        registerSeller,
        logoutSeller,
        getSellerDetails,
      }}
    >
      {children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => useContext(SellerAuthContext);
