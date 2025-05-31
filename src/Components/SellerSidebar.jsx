"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SellerSidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // clear user + role from context/localStorage
    router.push("/"); // redirect to home
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <ul className="nav flex-column gap-3">
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/seller/dashboard")}>
            Dashboard
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/seller/orders")}>
            Orders
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/seller/products")}>
            Products
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/seller/addproduct")}>
            Add Product
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/seller/profile")}>
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SellerSidebar;
