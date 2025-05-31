'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

const baseUrl = 'https://ecommerce-0zde.onrender.com';

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedUser = Cookies.get('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn("Failed to parse user cookie:", e);
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${baseUrl}/user/login`, { name: username, password });
      const { token, user } = res.data;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });

      setToken(token);
      setUser(user);
      router.push('/home');
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${baseUrl}/user/register`, { name, email, password });
      router.push('/login');
      return res.data.message || 'Registration successful!';
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || error.message
      );
    }
  };

  const forgotPassword = async (username, email, newPassword) => {
    try {
      const res = await axios.post(`${baseUrl}/user/forgotpassword`, {
        name: username,
        email,
        password: newPassword,
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const getUserDetails = async (username) => {
    try {
      const res = await axios.post(`${baseUrl}/user/getuserdetailsbyname`, { name: username });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };

  const addProfile = async (username, imageUrl) => {
    try {
      const res = await axios.post(`${baseUrl}/user/addprofile`, {
        name: username,
        image: imageUrl,
      });
      return res.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const getProfile = async (username) => {
    try {
      const res = await axios.post(`${baseUrl}/user/getprofile`, { name: username });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        forgotPassword,
        getUserDetails,
        addProfile,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
