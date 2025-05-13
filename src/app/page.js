"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push('/home');
    } else {
      router.push('/bhome');
    }
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Page;
