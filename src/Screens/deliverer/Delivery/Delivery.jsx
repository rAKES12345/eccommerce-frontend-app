"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Delivery = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const deliveryId=localStorage.getItem("deliveryId");

        if (!deliveryId ) {
          setError("Missing deliveryId in localStorage");
          return;
        }

        const res = await axios.post("https://ecommerce-0zde.onrender.com/deliverer/getdeliverydetails", {
          deliveryId
        });

        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch delivery details");
      }
    };

    fetchDeliveryDetails();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div className="text-gray-500">Loading...</div>;

  const { order, seller, item, user, delivery } = data;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600">Delivery Details</h2>

      {/* Order Details */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Order Info</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      </section>

      {/* Item Details */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Item Info</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <p><strong>Item Name:</strong> {item.name}</p>
          <p><strong>Brand:</strong> {item.brand}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>
          <p><strong>Discount:</strong> {item.discount}%</p>
          <p><strong>Stock:</strong> {item.stock}</p>
          <p><strong>Rating:</strong> {item.rating} ⭐</p>
        </div>
      </section>

      {/* Seller Details */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Seller Info</h3>
        <div className="text-gray-800">
          <p><strong>Name:</strong> {seller.name}</p>
          <p><strong>Email:</strong> {seller.email}</p>
        </div>
      </section>

      {/* User Details */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">User Info</h3>
        <div className="text-gray-800">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
        </div>
      </section>

      {/* Delivery Info */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Delivery Assignment</h3>
        <div className="text-gray-800">
          <p><strong>Delivery ID:</strong> {delivery.id}</p>
          <p><strong>Deliverer ID:</strong> {delivery.delivererId}</p>
        </div>
      </section>
    </div>
  );
};

export default Delivery;
