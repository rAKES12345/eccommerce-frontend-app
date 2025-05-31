"use client";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const DelivererSidebar = ({ setVisible }) => {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '250px' }}>
      <ul className="nav flex-column gap-3">
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/deliverer/home")}>
            Dashboard
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/deliverer/orders")}>
            Orders
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/deliverer/pendingdeliveries")}>
            Pending Deliveries
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/deliverer/history")}>
            Delivery History
          </button>
        </li>
        <li className="nav-item mb-2">
          <button className="nav-link text-white" onClick={() => router.push("/deliverer/earnings")}>
            Earnings Summary
          </button>
        </li>
       
        <li className="nav-item">
          <button className="nav-link text-white" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DelivererSidebar;
