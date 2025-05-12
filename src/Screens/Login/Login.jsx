"use client"
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
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
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
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
      </form>
    </div>
  );
}
