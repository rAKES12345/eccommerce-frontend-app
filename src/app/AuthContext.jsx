'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

// Define baseUrl outside of component so it’s accessible everywhere
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
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${baseUrl}/user/login`, {
        name: username,
        password,
      });

      const data = res.data;

      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

      setUser(data.user);
      setToken(data.token);

      router.push('/dashboard');
    } catch (error) {
      alert('Login error: ' + (error.response?.data?.message || error.message));
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post(`${baseUrl}/user/register`, {
        name: username,
        password,
      });

      alert('Registration successful. Please login.');
      router.push('/login');
    } catch (error) {
      alert('Register error: ' + (error.response?.data?.message || error.message));
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
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier use
export const useAuth = () => useContext(AuthContext);
