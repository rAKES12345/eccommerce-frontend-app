"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SuccessPopUp from "@/Components/SuccessPopUp";
import { useUserOperations } from "@/context/UserOperationsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const BuyNow = () => {
  const {
    product,
    order,
    fetchItemData,
    buyNow,
    updateOrder,
  } = useUserOperations();

  const { user } = useAuth();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchItemData();
    }
  }, [user]);

  const imageSrc = product?.image
    ? product.image.startsWith("data:")
      ? product.image
      : `data:image/jpeg;base64,${product.image}`
    : "https://via.placeholder.com/120";

  const handleInputChange = (e) => {
    updateOrder({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await buyNow(order);
      setShowPopup(true);

      // Optional: Redirect after a short delay
      setTimeout(() => {
        router.push("/orders"); // or home page
      }, 3000);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="container py-5 flex-grow-1">
        {showPopup && (
          <SuccessPopUp
            message="Order placed successfully!"
            onClose={() => setShowPopup(false)}
          />
        )}

        <div className="card shadow-lg rounded-4 p-4">
          <h2 className="mb-4 text-center text-primary fw-bold">
            Confirm Your Purchase
          </h2>
          <div className="row g-4">
            {/* Product Summary */}
            <div className="col-md-6">
              <div className="border rounded p-3 bg-white">
                <h5 className="fw-semibold mb-3">Product Summary</h5>
                <div className="d-flex gap-3 align-items-start">
                  <img
                    src={imageSrc}
                    alt={product?.name || "Product"}
                    className="img-thumbnail"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <div>
                    <p className="mb-1 fw-bold">{product?.name || "Loading..."}</p>
                    <p className="mb-1 text-muted">Brand: {product?.brand || "N/A"}</p>
                    <p className="mb-1 text-muted">Section: {product?.section || "N/A"}</p>
                    <p className="mb-1 text-muted">Rating: {product?.rating || "N/A"}</p>
                    <p className="mb-1 text-muted">Stock: {product?.stock || "N/A"}</p>
                    <p className="mb-1 text-muted">Discount: {product?.discount || 0}%</p>
                    <p className="mb-1 text-muted">
                      Tags: {product?.tags?.join(", ") || "N/A"}
                    </p>
                    <p className="mb-1">
                      {product?.description || "No description available."}
                    </p>
                    <h5 className="text-success mt-2">
                      ₹{product?.price?.toFixed(2) || "0.00"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Payment */}
            <div className="col-md-6">
              <div className="border rounded p-3 bg-white">
                <h5 className="fw-semibold mb-3">Shipping Details</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={order.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="3"
                      value={order.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      name="paymentMethod"
                      value={order.paymentMethod}
                      onChange={handleInputChange}
                      required
                    >
                      <option>Cash on Delivery</option>
                      <option>UPI</option>
                      <option>Credit/Debit Card</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyNow;
