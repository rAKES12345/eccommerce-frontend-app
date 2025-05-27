"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerNavbar from "@/Components/SellerNavbar";
import SellerSidebar from "@/Components/SellerSidebar";

const NAVBAR_HEIGHT = 60;

const Products = () => {
  const [sellerId, setSellerId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerIdAndProducts = async () => {
      try {
        const username = localStorage.getItem("userName");
        if (!username) throw new Error("User not logged in");

        const sellerRes = await axios.post(
          "http://localhost:9091/item/getselleridbyname",
          { name: username },
          { headers: { "Content-Type": "application/json" } }
        );

        const id = sellerRes.data.sellerId;
        if (!id) throw new Error("Seller ID not found");

        setSellerId(id);

        const productsRes = await axios.post(
          "http://localhost:9091/item/getitemsbysellerid",
          { sellerId: id },
          { headers: { "Content-Type": "application/json" } }
        );

        setProducts(productsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching products");
        setLoading(false);
      }
    };

    fetchSellerIdAndProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const storedSellerId = sellerId || localStorage.getItem("sellerId");

      const res = await axios.delete("http://localhost:9091/item/delete", {
        data: { id: productId, sellerId: storedSellerId },
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data);

      setProducts((prev) =>
        prev.filter((p) => p.id !== productId && p._id !== productId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Try again later.");
    }
  };

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
