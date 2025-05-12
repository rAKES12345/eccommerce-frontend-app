'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaFilter, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [username, setUsername] = useState("");
  const router=useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem("userName"));
  }, []);

  const handleProfileClick = () => {
    alert('Go to Profile');
  };

  const handleCartClick = () => {
    router.push("/cart")
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert('Search clicked');
    // Implement search functionality
  };

  const handleFilterClick = () => {
    alert('Open Filters');
    // Implement filter functionality
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <a className="navbar-brand fw-bold" href="/">ShopEase</a>

      <form className="d-flex mx-auto w-50 position-relative" onSubmit={handleSearch}>
        <div className='position-relative w-100'>
          <input
            className="form-control ps-5 border-0"
            style={{ border: 'none', outline: 'none', paddingLeft: '35px' }}
            type="search"
            placeholder="Search for products..."
            aria-label="Search"
          />
          <button className="position-absolute top-50 start-0 translate-middle-y ps-3" type="submit">
            <FaSearch size={18} style={{ color: '#6c757d' }} />
          </button>
        </div>
      </form>

      <div className="d-flex align-items-center gap-4">
        <div className='d-flex gap-1 align-items-center' style={{cursor:'pointer'}} onClick={handleProfileClick}>
          <FaUserCircle
            size={24}
            style={{ cursor: 'pointer' }}
            
          />
          <span className='ms-2' style={{ fontSize: '1.2rem', fontWeight: '500' , }}>{username || "Guest"}</span>
        </div>
        <div className='d-flex gap-1 align-items-center' style={{cursor:'pointer'}} onClick={handleCartClick}>
        <FaShoppingCart
          size={24}
          style={{ cursor: 'pointer' }}
          />
          <span className='ms-2' style={{ fontSize: '1.2rem', fontWeight: '500'}}>Cart</span>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
