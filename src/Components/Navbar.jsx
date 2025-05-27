"use client";
import React, { useState } from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaClipboardList,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const { user, searchItem, setSearchItem } = useAuth();

  const isLoggedIn = !!user;
  const username = user?.name || "Guest";

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchItem);
    // Add routing with query if needed
  };

  const handleNavigate = (path) => router.push(path);

  return (
    <>
      <nav className="navbar navbar-expand-md bg-white shadow-sm px-3 py-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Brand */}
          <a className="navbar-brand fw-bold fs-4" href="/">
            ShopEase
          </a>

          {/* Mobile search toggle */}
          {isLoggedIn && (
            <button
              className="btn d-md-none"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <FaSearch />
            </button>
          )}

          {/* Desktop Search */}
          {isLoggedIn && (
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
          )}

          {/* Right-side Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="btn btn-outline-secondary d-flex align-items-center gap-1"
                >
                  <FaUserCircle />
                  <span className="d-none d-sm-inline">{username}</span>
                </button>
                <button
                  onClick={() => handleNavigate("/cart")}
                  className="btn btn-outline-secondary d-flex align-items-center gap-1"
                >
                  <FaShoppingCart />
                  <span className="d-none d-sm-inline">Cart</span>
                </button>
                <button
                  onClick={() => handleNavigate("/orders")}
                  className="btn btn-outline-secondary d-flex align-items-center gap-1"
                >
                  <FaClipboardList />
                  <span className="d-none d-sm-inline">Orders</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleNavigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigate("/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Below Navbar */}
      {isLoggedIn && showMobileSearch && (
        <div className="bg-white shadow-sm px-3 py-2 d-md-none">
          <form onSubmit={handleSearch}>
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
        </div>
      )}
    </>
  );
};

export default Navbar;
