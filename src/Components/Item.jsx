"use client";
import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import axios from "axios";

const Item = ({ products }) => {
  const [cartIds, setCartIds] = useState(new Set());
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const roleValue = localStorage.getItem("role");
    if (name && roleValue) {
      setUserName(name);
      setRole(roleValue);
    }
  }, []);

  useEffect(() => {
    if (!userName || !role) return;

    const fetchCartItems = async () => {
      try {
        const response = await axios.post("http://localhost:9091/cart/userscarts", {
          name: userName,
        });
        const itemIds = response.data;
        if (Array.isArray(itemIds)) {
          setCartIds(new Set(itemIds.map(String)));
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    fetchCartItems();
  }, [userName, role]);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const addToCart = async (product) => {
    if (!userName || !role) {
      router.push("/login");
      return;
    }

    if (cartIds.has(String(product.id))) {
      showPopupMessage("Product already in cart");
      return;
    }

    try {
      await axios.post("http://localhost:9091/cart/add", {
        name: userName,
        itemId: product.id,
      });

      setCartIds((prev) => new Set(prev).add(String(product.id)));
      showPopupMessage("Added to cart");
    } catch (e) {
      console.error(e);
      showPopupMessage("Failed to add product");
    }
  };

  const handleProductClick = (product) => {
    if (product.stock <= 0) return;

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    router.push(`/product`);
  };

  if (!Array.isArray(products) || products.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="container my-4">
      {showPopup && (
        <Popup title="Cart" message={popupMessage} onClose={() => setShowPopup(false)} />
      )}

      <div className="row g-4">
        {products.map((product, index) => {
          const isInCart = cartIds.has(String(product.id));
          const discount = product.discount ? `${product.discount}% OFF` : null;
          const isOutOfStock = product.stock <= 0;

          return (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
              <div
                className="card h-100 border-0 shadow-sm rounded-4 hover-shadow"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              >
                <div
                  className="position-relative rounded-top-4 overflow-hidden"
                  style={{ height: "200px" }}
                >
                  <img
                    src={product.image || product.thumbnail || "default.jpg"}
                    alt={product.name || "Product Image"}
                    className="w-100 h-100 object-fit-cover"
                  />
                  {discount && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 fs-6 shadow-sm">
                      {discount}
                    </span>
                  )}
                </div>

                <div className="card-body d-flex flex-column p-3">
                  <h5 className="card-title text-truncate fw-semibold mb-2">
                    {product.name}
                  </h5>
                  <p className="text-muted small mb-1">
                    <strong>Section:</strong> {product.section}
                  </p>
                  <p className="text-muted small mb-1">
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p className="text-muted small mb-2">
                    <strong>Stock:</strong>{" "}
                    <span className={isOutOfStock ? "text-danger" : "text-success"}>
                      {isOutOfStock ? "Out of Stock" : "Available"}
                    </span>
                  </p>

                  <p className="text-muted small mb-3 flex-grow-1">
                    {product.description?.length > 70
                      ? product.description.slice(0, 70) + "..."
                      : product.description || "No description available."}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <span className="badge bg-primary px-3 py-2 fs-6">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="small text-muted mt-1">⭐ {product.rating}</div>
                    </div>

                    <button
                      className={`btn btn-sm rounded-pill px-3 ${
                        isInCart
                          ? "btn-secondary highlight-in-cart"
                          : isOutOfStock
                          ? "btn-outline-danger"
                          : "btn-outline-primary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? "Out of Stock" : isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 28px rgba(0, 0, 0, 0.15);
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .highlight-in-cart {
          border: 2px solid #ffc107 !important;
          box-shadow: 0 0 8px 2px #ffc107;
          background-color: #ffe082 !important;
          color: #212529 !important;
        }
      `}</style>
    </div>
  );
};

export default Item;
