"use client";
import React, { useEffect, useState } from "react";
import SellerNavbar from "@/Components/SellerNavbar";
import SellerSidebar from "@/Components/SellerSidebar";
import { useSellerOperations } from "@/context/SellerOperationsContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Orders = () => {
  const { orders, fetchSellerOrders, makeShipment } = useSellerOperations();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchSellerOrders();
      setLoading(false);
    };
    loadOrders();
  }, []);

  return (
    <div className="min-vh-100 bg-light p-4">
      <h3 className="mb-4 text-primary">Your Orders</h3>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Loading orders, please wait...</div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-primary sticky-top">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Item ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Ship Order</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.itemId}</td>
                  <td>{order.name}</td>
                  <td>{order.address}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status !== "SHIPPED" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => makeShipment(order.id)}
                      >
                        Mark as Shipped
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
