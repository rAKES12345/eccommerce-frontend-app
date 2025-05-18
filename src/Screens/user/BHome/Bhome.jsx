"use client"
import { useRouter } from 'next/navigation';

const Bhome = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our E-Commerce Platform</h1>
        <p className="text-gray-600 mb-6">
          Discover a wide range of products tailored to your needs. Sign in or register to start shopping!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bhome;
