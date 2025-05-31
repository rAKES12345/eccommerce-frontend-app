"use client";

import { useSellerAuth } from "@/context/SellerAuthContext";
import Popup from "@/Components/Popup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [popupMessage, setPopupMessage] = useState(null);

  const { loginSeller } = useSellerAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSeller(formData.name, formData.password);
    } catch (error) {
      setPopupMessage(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />}

      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Seller Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <div
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") togglePasswordVisibility();
              }}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => router.push("/seller/register")}
            className="mt-2 inline-block text-indigo-600 hover:underline font-medium"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
