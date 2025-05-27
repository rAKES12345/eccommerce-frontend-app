"use client";
import React, { useEffect, useState } from 'react';
import SellerNavbar from '@/Components/SellerNavbar';
import SellerSidebar from '@/Components/SellerSidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const role = localStorage.getItem("role");
        const sellerName = localStorage.getItem("userName");

        if (role !== "seller" || !sellerName) return;

        const sellerRes = await axios.post("http://localhost:9091/seller/getsellerdetailsbyname", { name: sellerName });
        const sellerId = sellerRes.data?.id;

        if (!sellerId) return;

        const orderRes = await axios.post("http://localhost:9091/order/getbysellerorders", { sellerId });

        if (Array.isArray(orderRes.data)) {
          setOrders(orderRes.data);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchSellerOrders();
  }, []);

  // Function to update order status to "SHIPPED"
  const makeShipment = async (orderId) => {
    try {
      await axios.post("http://localhost:9091/order/updateorderstatus", {
        orderId,
        status: "SHIPPED",
      });

      // Update local state after successful status update
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: "SHIPPED" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="">
        <div className="flex-grow-1 p-4">
          <h3 className="mb-4 text-primary">Your Orders</h3>
          {orders.length === 0 ? (
            <div className="alert alert-info">No orders found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover bg-white">
                <thead className="table-primary">
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
      </div>
    </div>
  );
};

export default Orders;
