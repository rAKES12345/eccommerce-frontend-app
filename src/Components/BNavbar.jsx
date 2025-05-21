'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaSearch, FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const BNavbar = () => {
  const [username, setUsername] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem("userName"));
  }, []);

  const handleLoginClick = () => router.push("/login");
  const handleRegisterClick = () => router.push("/register");

  const handleSearchIconClick = () => {
    setShowSearchBar(prev => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <>
      <nav className="navbar bg-light shadow-sm px-3 py-2">
  <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between">
    <a className="navbar-brand fw-bold" href="/">ShopEase</a>

    <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
      {/* Search Icon */}
      <button className="btn btn-outline-secondary p-1" onClick={handleSearchIconClick}>
        <FaSearch size={18} />
      </button>

      {/* Login Button */}
      <button className="btn btn-outline-primary d-flex align-items-center gap-1 p-1" onClick={handleLoginClick}>
        <FaUserCircle size={20} />
        <span className="d-none d-sm-inline">Login</span>
      </button>

      {/* Register Button */}
      <button className="btn btn-outline-success d-flex align-items-center gap-1 p-1" onClick={handleRegisterClick}>
        <FaUserPlus size={20} />
        <span className="d-none d-sm-inline">Register</span>
      </button>
    </div>
  </div>
</nav>


      {/* Conditional Search Bar Below Navbar */}
      {showSearchBar && (
        <div className="bg-white border-bottom py-3 px-3 shadow-sm">
          <form onSubmit={handleSearch} className="d-flex justify-content-center">
            <input
              type="text"
              className="form-control w-75"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary ms-2" type="submit">Search</button>
          </form>
        </div>
      )}
    </>
  );
};

export default BNavbar;
