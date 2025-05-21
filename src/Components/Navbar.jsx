'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaSearch, FaClipboardList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem("userName") || "Guest");
  }, []);

  const handleProfileClick = () => router.push("/profile");
  const handleCartClick = () => router.push("/cart");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
    setSearchTerm("");
  };

  const handleOrdersClick = (e) => {
    e.preventDefault();
    router.push("/orders");
  };

  return (
    <nav className="navbar bg-light px-3 py-2 shadow-sm d-flex align-items-center justify-content-between">
      {/* Brand */}
      <a className="navbar-brand fw-bold m-0" href="/">ShopEase</a>

      {/* Search bar (visible on md and above) */}
      <form onSubmit={handleSearch} className="d-none d-md-flex mx-auto w-50">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>

      {/* Profile & Cart & Orders Icons (always visible) */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center gap-1"
          style={{ cursor: 'pointer' }}
          onClick={handleProfileClick}
        >
          <FaUserCircle size={22} />
          <span className="d-none d-sm-inline fw-medium">{username}</span>
        </div>
        <div
          className="d-flex align-items-center gap-1"
          style={{ cursor: 'pointer' }}
          onClick={handleCartClick}
        >
          <FaShoppingCart size={22} />
          <span className="d-none d-sm-inline fw-medium">Cart</span>
        </div>
        <div
          className="d-flex align-items-center gap-1"
          style={{ cursor: 'pointer' }}
          onClick={handleOrdersClick}
        >
          <FaClipboardList size={22} />
          <span className="d-none d-sm-inline fw-medium">Orders</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
