"use client";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import Spinner from '@/Components/Spinner';
import { useRouter } from 'next/navigation';
import Popup from '@/Components/Popup';

const Product = () => {
  const [product, setProduct] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartIds, setCartIds] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dummyName = localStorage.getItem("userName");
    if (dummyName) setUserName(dummyName);
  }, []);

  useEffect(() => {
    if (!userName) return;

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
  }, [userName]);

  const addToCart = async (id) => {
    if (!userName) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9091/cart/add", {
        name: userName,
        itemId: id,
      });

      if (response.status === 200) {
        setCartIds(prev => new Set(prev).add(String(id)));
        setShowPopup(true);
      } else {
        alert("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong while adding to cart.");
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("selectedProduct");
    if (data) {
      const parsed = JSON.parse(data);
      parsed.rating = Math.max(0, Math.min(5, parseFloat(parsed.rating) || 0));
      setProduct(parsed);
    }
  }, []);

  if (!product) {
    return <Spinner />;
  }

  const getDiscountedPrice = () => {
    if (product.discount > 0) {
      return (product.price - (product.price * product.discount) / 100).toFixed(2);
    }
    return product.price.toFixed(2);
  };

  const isInCart = cartIds.has(String(product.id));

  const buyNow = (id) => {
    const dummyName = localStorage.getItem("userName");
    if (!dummyName) {
      router.push("/login");
    } else {
      localStorage.setItem("buyNowProductId", id);
      router.push("/buynow");
    }
  };

  return (
    <div className="d-flex flex-column bg-light">
      {showPopup && <Popup message="Item added to cart successfully" />}
      <main className="container py-4 flex-grow-1">
        <div className="card shadow border-0 rounded-4 p-3 position-relative bg-white">

          <button className="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3">
            <i className="bi bi-heart-fill text-danger fs-5"></i>
          </button>

          <div className="row g-4 flex-column flex-md-row">
            <div className="col-md-5 d-flex align-items-center justify-content-center">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name || "Product Image"}
                className="img-fluid p-3 rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>

            <div className="col-md-7">
              <div className="px-md-3 d-flex flex-col align-center justify-center">
                <h2 className="fw-bold mb-2">{product.name}</h2>
                <p className="text-muted mb-1">
                  Brand: <strong>{product.brand}</strong> | Section: <strong>{product.section}</strong>
                </p>
                <p className="text-muted mb-1">
                  Rating: <strong>{product.rating} / 5</strong> | Stock: <strong>{product.stock}</strong>
                </p>

                <div className="text-warning fs-5 mb-3">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
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
                            width: '25px',
                            height: '25px',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {product.sizes?.length > 0 && (
                  <>
                    <p className="mb-1 text-muted">Sizes:</p>
                    <select className="form-select w-auto mb-3">
                      {product.sizes.map((size, idx) => (
                        <option key={idx} value={size}>{size}</option>
                      ))}
                    </select>
                  </>
                )}

                <p className="text-muted">{product.description || "No description available."}</p>

                {product.discount > 0 && (
                  <p className="text-danger fw-semibold mb-2">
                    Discount: {product.discount}% OFF
                  </p>
                )}

                {product.tags?.length > 0 && (
                  <div className="mb-2">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary me-2">{tag}</span>
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
                      <button className="btn btn-outline-secondary px-4 rounded-3 shadow-sm" disabled>
                        In Cart
                      </button>
                    ) : (
                      <button className="btn btn-success px-4 rounded-3 shadow-sm" onClick={() => addToCart(product.id)}>
                        Add to Cart +
                      </button>
                    )}
                    <button className="btn btn-primary px-4 rounded-3 shadow-sm" onClick={() => buyNow(product.id)}>
                      Buy Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
