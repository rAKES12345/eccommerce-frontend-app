'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaSearch, FaClipboardList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';

const CartNavbar = () => {
  const [username, setUsername] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const {searchItem, setSearchItem } = useAuth();


  useEffect(() => {
    setUsername(localStorage.getItem("userName"));
  }, []);

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(prev => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm("");
  };

  const handleOrdersClick=(e)=>{
    router.push("/orders");

  }

  return (
    <>
      <nav className="navbar bg-light shadow-sm px-3 py-2">
        <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between">
          <a className="navbar-brand fw-bold" href="/">Synkart</a>
           {/* Desktop Search */}
                  <form
                    onSubmit={handleSearch}
                    className="d-none d-md-flex mx-auto w-50"
                  >
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for products..."
                        value={searchItem || ""}
                        onChange={(e) => setSearchItem(e.target.value)}
                      />
                    </div>
                  </form>
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            {/* Search Icon */}
            <button className="d-md-none btn btn-outline-secondary p-1" onClick={handleSearchIconClick}>
              <FaSearch size={18} />
            </button>

            {/* Profile Button */}
            <button className="btn btn-outline-primary d-flex align-items-center gap-1 p-1" onClick={handleProfileClick}>
              <FaUserCircle size={20} />
              <span className="d-none d-sm-inline">{username || "Guest"}</span>
            </button>

            <button className="btn btn-outline-primary d-flex align-items-center gap-1 p-1" onClick={handleOrdersClick}>
             <FaClipboardList size={22} />
              <span className="d-none d-sm-inline">Orders</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Search Bar */}
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

export default CartNavbar;
