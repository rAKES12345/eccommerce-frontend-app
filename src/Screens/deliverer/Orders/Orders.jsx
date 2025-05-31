"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Orders = () => {
    const router=useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupLoading, setPickupLoading] = useState(null);

  // Replace with actual deliverer ID (e.g., from auth or context)
  const delivererId = "sample-deliverer-id";

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://ecommerce-0zde.onrender.com/order/getall");
      const data = response.data;
      const pendingOrders = data.filter(
        (order) => order.status?.toUpperCase() === "PENDING"
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickUp = async (order) => {
    setPickupLoading(order.id);
    try {
      const response = await axios.post(
        "https://ecommerce-0zde.onrender.com/deliverer/pickup",
        {
          orderId: order.id,
          delivererId: delivererId, 
        }
      );

      alert(response.data); // backend returns a plain string
      fetchPendingOrders(); // refresh list
      localStorage.setItem("delivererId",delivererId);
      localStorage.setItem("orderId",order.id);
      router.push("/deliverer/delivery");
    } catch (error) {
      console.error("Failed to pick up delivery:", error);
      alert(
        error.response?.data || "Something went wrong while picking up the order."
      );
    } finally {
      setPickupLoading(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No pending orders available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">{order.name}</h3>
              <p>
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">Date:</span> {order.date}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium text-yellow-600">Status:</span>{" "}
                {order.status}
              </p>
              <button
                onClick={() => handlePickUp(order)}
                disabled={pickupLoading === order.id}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {pickupLoading === order.id ? "Picking up..." : "Pick Up"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
