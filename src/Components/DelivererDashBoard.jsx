"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SellerNavbar from './SellerNavbar';
import SellerSidebar from './SellerSidebar';
import axios from 'axios';
import DelivererSidebar from './DelivererSidebar';

const DelivererDashBoard = () => {
  const [totalOrders, setTotalOrders] = useState("");
  const [totalProducts, setTotalProducts] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const role = localStorage.getItem("role");
        const sellerName = localStorage.getItem("userName");

        if (role !== "seller" || !sellerName) return;

        const sellerRes = await axios.post("http://localhost:9091/seller/getsellerdetailsbyname", { name: sellerName });
        const sellerId = sellerRes.data?.id;

        if (!sellerId) {
          console.error("Seller ID not found.");
          return;
        }

        const orderRes = await axios.post("http://localhost:9091/order/totalsellersorders", { "sellerId":sellerId });
        setTotalOrders(orderRes.data);

        const productRes = await axios.post("http://localhost:9091/item/totalsellersproducts", { "sellerId":sellerId });
        setTotalProducts(productRes.data);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setTotalOrders("Error");
        setTotalProducts("Error");
      }
    };

    fetchDashboardData();
  }, []);

  return (
      <div className='d-flex flex-grow-1 '>
        <div className="p-4 flex-grow-1 bg-light">
          <h2 className="mb-4">Welcome to Deliverer Dashboard</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Orders  Received</h5>
                  <p className="card-text">{totalOrders}</p> 
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">{totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Revenue</h5>
                  <p className="card-text">$2,500</p> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DelivererDashBoard;
