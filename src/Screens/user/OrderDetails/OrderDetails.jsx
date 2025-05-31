"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserOperations } from "@/context/UserOperationsContext";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  const { loadOrderData } = useUserOperations();

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadOrderData();

      if (!data || !data.order) {
        setLoading(false);
        return;
      }

      setOrder(data.order);
      setItem(data.item);
      setSeller(data.seller);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container my-5 text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="container my-5 alert alert-warning">No order data found.</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-primary fw-bold mb-4">Order Details</h2>
      <div className="card shadow-sm p-4">
        <div className="mb-3"><strong>Order ID:</strong> {order.id}</div>
        <div className="mb-3"><strong>Status:</strong> {order.status}</div>
        <div className="mb-3"><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
        <div className="mb-3"><strong>Payment Method:</strong> {order.paymentMethod}</div>
        <div className="mb-3"><strong>Delivery Address:</strong> {order.address}</div>

        <hr />

        <h5 className="fw-bold mt-4">Item Information</h5>
        {item ? (
          <div className="d-flex align-items-center gap-3 mb-3">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                className="rounded"
              />
            ) : (
              <div className="bg-secondary rounded" style={{ width: "100px", height: "100px" }} />
            )}
            <div>
              <div><strong>Name:</strong> {item.name}</div>
              <div><strong>Brand:</strong> {item.brand || "N/A"}</div>
              <div><strong>Description:</strong> {item.description || "No description"}</div>
              <div><strong>Price:</strong> ₹{item.price?.toFixed(2)}</div>
              <div><strong>Quantity:</strong> {order.quantity || 1}</div>
              <div><strong>Total:</strong> ₹{(item.price * (order.quantity || 1)).toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <div className="text-muted">Item details not available.</div>
        )}

        <hr />

        <h5 className="fw-bold mt-4">Seller Information</h5>
        {seller ? (
          <div>
            <div><strong>Name:</strong> {seller.name}</div>
            <div><strong>Email:</strong> {seller.email}</div>
            <div><strong>Contact:</strong> {seller.phone || "N/A"}</div>
            <div><strong>Location:</strong> {seller.address || "N/A"}</div>
          </div>
        ) : (
          <div className="text-muted">Seller details not available.</div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
