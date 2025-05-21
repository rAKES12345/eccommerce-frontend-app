"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [itemsData, setItemsData] = useState({});
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("userName");
  const router=useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post("http://localhost:9091/order/getusersorders", { name });
        setOrders(res.data);

        const itemRequests = res.data.map((order) =>
          axios.post("http://localhost:9091/item/getitembyid", {
            "id": order.itemId,
          })
        );

        const itemsResponses = await Promise.all(itemRequests);
        const itemsMap = {};
        itemsResponses.forEach((response) => {
          if (response.data && response.data.id) {
            itemsMap[response.data.id] = response.data;
          }
        });
        setItemsData(itemsMap);
      } catch (error) {
        console.error("Error fetching orders or items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [name]);

  const getStatusClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DELIVERED":
        return "bg-success text-white";
      case "PENDING":
        return "bg-warning text-dark";
      case "CANCELLED":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const openOrder=(order)=>{
    localStorage.setItem("orderData",JSON.stringify(order));
    router.push("/orderDetails");
  }

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary fw-bold mb-4">Your Orders</h2>
      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info text-center">You have no orders yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => {
            const item = itemsData[order.itemId] || {};
            return (
              <div
                key={order.id}
                className={`card border-0 shadow-sm ${order.status === "PENDING" ? "bg-light" : "bg-white"}`
              }
              onClick={()=>openOrder(order)}
              >
                <div className="card-body d-flex flex-row align-items-center">
                  {/* Checkbox */}
                  <div className="form-check me-3">
                    <input className="form-check-input" type="checkbox" />
                  </div>

                  {/* Product Image */}
                  <div className="me-3">
                    {item.image ? (
                      <img
                       src={item.image}
                       alt={item.name}
                       className="rounded"
                       style={{ width: "70px", height: "70px", objectFit: "cover" }}
                      />

                    ) : (
                      <div className="bg-secondary rounded" style={{ width: "70px", height: "70px" }} />
                    )}
                  </div>

                  {/* Product and order info */}
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.name || "Unnamed Item"}</div>
                    <div>Order ID: {order.id}</div>
                    <div>
                      {item.description || "No description"}<br />
                      Brand: {item.brand || "N/A"}
                    </div>
                    <div className="text-muted small">
                      Quantity: {order.quantity || 1} | ₹
                      {item.price ? Number(item.price).toFixed(2) : "0.00"}
                    </div>
                  </div>

                  {/* Delivery Date */}
                  <div className="me-4 text-center">
                    <div className="fw-bold">
                      {new Date(order.date || Date.now()).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div>
                      <i className="bi bi-shop" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="me-4 text-center">
                    ₹{item.price ? Number(item.price).toFixed(2) : "0.00"}
                    <div>
                      <i className="bi bi-credit-card" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`badge px-3 py-2 ${getStatusClass(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
