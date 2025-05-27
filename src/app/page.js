// app/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/Components/Spinner';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");

    if (isLoggedIn) {
      switch (role) {
        case "user":
          router.push("/home");
          break;
        case "seller":
          router.push("/seller/home");
          break;
        case "admin":
          router.push("/admin/home");
          break;
        case "deliverer":
          router.push("/deliverer/home");
          break;
        default:
          router.push("/home");
      }
    } else {
      router.push("/home");
    }
  }, [router]);

  return <Spinner />;
};

export default Page;
