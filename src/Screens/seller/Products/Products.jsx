"use client";
import React, { useEffect } from "react";
import axios from "axios";
import SellerNavbar from "@/Components/SellerNavbar";
import SellerSidebar from "@/Components/SellerSidebar";
import { useSellerOperations } from "@/context/SellerOperationsContext";

const NAVBAR_HEIGHT = 60;

const Products = () => {
  const {
    sellerId,
    products,
    loading,
    error,
    fetchSellerIdAndProducts,
    handleDelete,
    setProducts, // Optional: if needed to update after delete
  } = useSellerOperations();

  useEffect(() => {
    fetchSellerIdAndProducts();
  }, []);

 
  return (
    <div>
      <div
        className="d-flex"
        style={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <main
          className="container mt-4 flex-grow-1"
          style={{
            overflowY: "auto",
            maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <h2>Products</h2>

          {loading && <p>Loading products...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>No products found for this seller.</p>
          )}

          <div className="row">
            {products.map((product) => {
              const productId = product.id || product._id;

              return (
                <div className="col-md-4 mb-4" key={productId}>
                  <div className="card h-100 shadow-sm">
                    {product.image && (
                      <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-truncate">{product.description}</p>
                      <p className="mb-1">
                        <strong>Price:</strong> ₹{product.price}
                      </p>
                      <p className="mb-1">
                        <strong>Stock:</strong> {product.stock}
                      </p>
                      <p className="mb-1">
                        <strong>Rating:</strong> {product.rating}
                      </p>
                      <p className="mb-1">
                        <strong>Discount:</strong> {product.discount}%
                      </p>
                      <p className="mb-1">
                        <strong>Tags:</strong> {product.tags?.join(", ")}
                      </p>
                      <div className="mt-auto">
                        <button
                          className="btn btn-danger w-100"
                          onClick={() => handleDelete(productId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
