"use client";
import { useAuth } from '@/app/AuthContext'; // Adjust if needed
import Popup from '@/Components/Popup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [popupMessage, setPopupMessage] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:9091/user/login", formData);
      
      if (res.status === 200 && res.data === `welcome ${formData.name}`) {
        const dummyUser = {
          name: formData.name,
          role: "user"
        };
        login(dummyUser);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userName", formData.name);
        localStorage.setItem("role", "user");
        router.push("/home");
      } else {
        setPopupMessage(res.data);
        console.log("response: " + res.data);
      }
    } catch (e) {
      setPopupMessage("Something went wrong. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={passwordVisible ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            placeholder="Enter your password"
          />
          <div
            className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center text-gray-500 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
              onClick={() => router.push('/register')}
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
