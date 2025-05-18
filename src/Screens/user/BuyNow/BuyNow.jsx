"use client";

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/Components/Navbar/Navbar';
import Footer from '@/Components/Footer';
import axios from 'axios';

const BuyNow = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const id = localStorage.getItem("buyNowProductId");
        if (!id) return;

        const res = await axios.post("http://localhost:9091/item/getitembyid", { id });
        setProduct(res.data);
      } catch (e) {
        console.log("Error fetching product:", e);
      }
    };
    fetchItemData();
  }, []);

  const imageSrc = product?.image
  ? product.image.startsWith('data:')
    ? product.image // already full data URI
    : `data:image/jpeg;base64,${product.image}`
  : "https://via.placeholder.com/120";

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <main className="container py-5 flex-grow-1">
        <div className="card shadow-lg rounded-4 p-4">
          <h2 className="mb-4 text-center text-primary fw-bold">Confirm Your Purchase</h2>

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
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  <div>
                    <p className="mb-1 fw-bold">{product?.name || "Loading..."}</p>
                    <p className="mb-1 text-muted">Brand: {product?.brand || "N/A"}</p>
                    <p className="mb-1 text-muted">Section: {product?.section || "N/A"}</p>
                    <p className="mb-1 text-muted">Rating: {product?.rating || "N/A"}</p>
                    <p className="mb-1 text-muted">Stock: {product?.stock || "N/A"}</p>
                    <p className="mb-1 text-muted">Discount: {product?.discount || 0}%</p>
                    <p className="mb-1 text-muted">Tags: {product?.tags?.join(", ") || "N/A"}</p>
                    <p className="mb-1">{product?.description || "No description available."}</p>
                    <h5 className="text-success mt-2">₹{product?.price?.toFixed(2) || "0.00"}</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Payment */}
            <div className="col-md-6">
              <div className="border rounded p-3 bg-white">
                <h5 className="fw-semibold mb-3">Shipping Details</h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter your full name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" rows="3" placeholder="Enter your address"></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select">
                      <option>Cash on Delivery</option>
                      <option>UPI</option>
                      <option>Credit/Debit Card</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">Place Order</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyNow;
