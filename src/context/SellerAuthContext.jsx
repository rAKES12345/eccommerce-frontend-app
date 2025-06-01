'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const baseUrl = 'https://ecommerce-0zde.onrender.com';
export const SellerAuthContext = createContext();

export const SellerAuthProvider = ({ children }) => {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedToken = Cookies.get('sellerToken');
    const savedSeller = Cookies.get('sellerUser');

    if (savedToken && savedSeller) {
      try {
        const parsedSeller = JSON.parse(savedSeller);
        setToken(savedToken);
        setSeller(parsedSeller);
      } catch (e) {
        console.warn('Failed to parse seller cookie:', e);
      }
    }

    setIsLoaded(true);
  }, []);

  const loginSeller = async (name, password) => {
    try {
      const res = await axios.post(`${baseUrl}/seller/login`, { name, password });
      const { token, seller } = res.data;

      Cookies.set('sellerToken', token, { expires: 7 });
      Cookies.set('sellerUser', JSON.stringify({ username: name, role: 'seller' }), { expires: 7 });

      setToken(token);
      setSeller({ ...seller, role: 'seller' });

      router.push('/seller/home');
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const registerSeller = async (formData) => {
    try {
      const res = await axios.post(`${baseUrl}/seller/register`, formData);

      if (res.data.message === "Registered successfully") {
        router.push("/seller/login");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
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
        isLoaded,
      }}
    >
      {children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => useContext(SellerAuthContext);
