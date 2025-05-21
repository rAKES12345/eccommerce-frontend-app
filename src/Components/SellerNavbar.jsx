'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const SellerNavbar = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem("userName"));
  }, []);

  const handleProfileClick = () => {
    if(localStorage.getItem("role")=="seller"){
    router.push("/seller/profile");
    }else{
      router.push("/deliverer/profile");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4" style={{ height: '60px' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a className="navbar-brand fw-bold fs-4" href="/" style={{ color: '#2c3e50' }}>
          ShopEase
        </a>

        <div
          className="d-flex align-items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          <FaUserCircle size={28} color="#4a4a4a" />
          <span
            className="ms-2 fw-semibold"
            style={{
              fontSize: '1.1rem',
              color: '#34495e',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {username || "Guest"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;
