"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/Components/Spinner';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    if (isLoggedIn === "true" && role=="user") {
      router.push('/home');
    } else if(isLoggedIn=="true" && role=="seller") {
      router.push('/seller/home');
    }else if(isLoggedIn=="true" && role=="admin"){
      router.push("/admin/home");
    }else if(isLoggedIn=="true" && role=="deliverer"){
      router.push("/deliverer/home");
    }else{
      router.push("/home");
    }
  }, [router]);

  return <Spinner />;
};

export default Page;
