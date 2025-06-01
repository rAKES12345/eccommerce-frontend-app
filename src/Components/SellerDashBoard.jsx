"use client";

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";
import { useSellerOperations } from "@/context/SellerOperationsContext";

const SellerDashboard = () => {
  const { totalOrders, totalProducts, fetchDashboardData } = useSellerOperations();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div>
      <div className="d-flex">
        <div className="p-4 flex-grow-1 bg-light">
          <h2 className="mb-4">Welcome to Seller Dashboard</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Orders Received</h5>
                  <p className="card-text">
                    {totalOrders !== null ? totalOrders : "Loading..."}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">
                    {totalProducts !== null ? totalProducts : "Loading..."}
                  </p>
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
    </div>
  );
};

export default SellerDashboard;
