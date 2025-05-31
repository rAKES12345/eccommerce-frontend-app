"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Spinner from "@/Components/Spinner";
import Popup from "@/Components/Popup";
import { useRouter } from "next/navigation";
import { useUserOperations } from "@/context/UserOperationsContext";
import { AuthContext, useAuth } from "@/context/AuthContext";

const Product = () => {
  const { product, setProduct,  cartIds, addToCart } = useUserOperations();
  const {user}=useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [userName,setUserName]=useState("");

  // Load product from localStorage once on mount if not already loaded
  useEffect(() => {
    setUserName(user.username);
    if (product) return; // Already loaded by context
    const data = localStorage.getItem("selectedProduct");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // sanitize rating between 0 and 5, fallback 0 if invalid
        parsed.rating = Math.max(0, Math.min(5, parseFloat(parsed.rating) || 0));
        setProduct(parsed);
      } catch (err) {
        console.error("Failed to parse selectedProduct from localStorage:", err);
      }
    }
  }, [product, setProduct]);

  // Check if product is in cart
  const isInCart = product ? cartIds.has(String(product.id)) : false;

  const getDiscountedPrice = () => {
    if (!product) return "";
    if (product.discount > 0) {
      return (product.price - (product.price * product.discount) / 100).toFixed(2);
    }
    return product.price.toFixed(2);
  };

  const handleAddToCart = async (id) => {
    if (!userName) {
      router.push("/login");
      return;
    }

    const result = await addToCart(id);
    if (result.success) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } else {
      alert(result.message || "Failed to add to cart.");
    }
  };

  const buyNow = (id) => {
    if (!userName) {
      router.push("/login");
    } else {
      localStorage.setItem("buyNowProductId", id);
      router.push("/buynow");
    }
  };

  if (!product) {
    return <Spinner />;
  }

  return (
    <div className="d-flex flex-column bg-light min-vh-100">
      {showPopup && <Popup message="Item added to cart successfully" />}
      <main className="container py-4 flex-grow-1">
        <div className="card shadow border-0 rounded-4 p-3 position-relative bg-white">
          <button
            className="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3"
            aria-label="Favorite"
          >
            <i className="bi bi-heart-fill text-danger fs-5"></i>
          </button>

          <div className="row g-4 flex-column flex-md-row">
            <div className="col-md-5 d-flex align-items-center justify-content-center">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name || "Product Image"}
                className="img-fluid p-3 rounded"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>

            <div className="col-md-7">
              <div className="px-md-3 d-flex flex-column justify-content-center">
                <h2 className="fw-bold mb-2">{product.name}</h2>
                <p className="text-muted mb-1">
                  Brand: <strong>{product.brand}</strong> | Section: <strong>{product.section}</strong>
                </p>
                <p className="text-muted mb-1">
                  Rating: <strong>{product.rating} / 5</strong> | Stock: <strong>{product.stock}</strong>
                </p>

                <div className="text-warning fs-5 mb-3" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>

                {product.colors?.length > 0 && (
                  <>
                    <p className="mb-1 text-muted">Colors:</p>
                    <div className="d-flex gap-2 mb-3">
                      {product.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="rounded-circle border border-secondary"
                          style={{
                            backgroundColor: color,
                            width: "25px",
                            height: "25px",
                          }}
                          aria-label={`Color option ${color}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {product.sizes?.length > 0 && (
                  <>
                    <p className="mb-1 text-muted">Sizes:</p>
                    <select className="form-select w-auto mb-3" aria-label="Select size">
                      {product.sizes.map((size, idx) => (
                        <option key={idx} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <p className="text-muted">{product.description || "No description available."}</p>

                {product.discount > 0 && (
                  <p className="text-danger fw-semibold mb-2">Discount: {product.discount}% OFF</p>
                )}

                {product.tags?.length > 0 && (
                  <div className="mb-2">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary me-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {product.reviews && (
                  <blockquote className="blockquote text-muted">
                    <small>"{product.reviews}"</small>
                  </blockquote>
                )}

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div>
                    {product.discount > 0 && (
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                    <span className="fs-4 fw-bold text-dark">₹{getDiscountedPrice()}</span>
                  </div>

                  <div className="d-flex gap-2">
                    {isInCart ? (
                      <button
                        className="btn btn-outline-secondary px-4 rounded-3 shadow-sm"
                        disabled
                        aria-disabled="true"
                        aria-label="Product already in cart"
                      >
                        In Cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-success px-4 rounded-3 shadow-sm"
                        onClick={() => handleAddToCart(product.id)}
                        aria-label="Add product to cart"
                      >
                        Add to Cart +
                      </button>
                    )}
                    <button
                      className="btn btn-primary px-4 rounded-3 shadow-sm"
                      onClick={() => buyNow(product.id)}
                      aria-label="Buy now"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
