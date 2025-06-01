'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const baseUrl = 'https://ecommerce-0zde.onrender.com';
export const DelivererAuthContext = createContext();

export const DelivererAuthProvider = ({ children }) => {
  const router = useRouter();
  const [deliverer, setDeliverer] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedToken = Cookies.get('delivererToken');
    const savedDeliverer = Cookies.get('delivererUser');

    if (savedToken && savedDeliverer) {
      try {
        const parsedDeliverer = JSON.parse(savedDeliverer);
        setToken(savedToken);
        setDeliverer(parsedDeliverer);
      } catch (e) {
        console.warn('Failed to parse deliverer cookie:', e);
      }
    }

    setIsLoaded(true);
  }, []);

  const loginDeliverer = async (name, password) => {
    try {
      const res = await axios.post(`${baseUrl}/deliverer/login`, { name, password });
      const { token, deliverer } = res.data;

      Cookies.set('delivererToken', token, { expires: 7 });
      Cookies.set('delivererUser', JSON.stringify({ username: name, role: 'deliverer' }), { expires: 7 });

      setToken(token);
      setDeliverer({ ...deliverer, role: 'deliverer' });

      router.push('/deliverer/home');
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const registerDeliverer = async (formData) => {
    try {
      const res = await axios.post(`${baseUrl}/deliverer/register`, formData);
      if (res.data.message === 'Registered successfully') {
        router.push('/deliverer/login');
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const getDelivererDetails = async (name) => {
    try {
      const res = await axios.post(`${baseUrl}/deliverer/getdetailsbyname`, { name });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };

  const logoutDeliverer = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.set(cookieName, '', { expires: -1 });
    });

    setDeliverer(null);
    setToken(null);
    router.push('/');
  };

  return (
    <DelivererAuthContext.Provider
      value={{
        deliverer,
        token,
        loginDeliverer,
        registerDeliverer,
        logoutDeliverer,
        getDelivererDetails,
        isLoaded,
      }}
    >
      {children}
    </DelivererAuthContext.Provider>
  );
};

export const useDelivererAuth = () => useContext(DelivererAuthContext);
