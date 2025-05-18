"use client";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar/Navbar';
import Spinner from '@/Components/Spinner';
import { useRouter } from 'next/navigation';
import Popup from '@/Components/Popup';

const Product = () => {
  const [product, setProduct] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartIds, setCartIds] = useState(new Set());

  const [showPopup, setShowPopup] = useState(false);

  const router=useRouter();

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
    alert("Please login to add items to cart.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:9091/cart/add", {
      "name": userName,
      "itemId": id,
    });

    if (response.status === 200) {
      // Add the product id to cartIds state to update UI
      setCartIds(prev => new Set(prev).add(String(id)));
      setShowPopup(!showPopup);
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
      setProduct(JSON.parse(data));
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

  const isInCart = product && cartIds.has(String(product.id));

  const buyNow=(id)=>{
    localStorage.setItem("buyNowProductId",id);
    router.push("/buynow");
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      {showPopup && <Popup message={"Item added to cart successfully"}  />}
      <main className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0 rounded-4 p-3 position-relative">

          {/* Wishlist Heart Icon */}
          <button className="btn btn-light rounded-circle border position-absolute top-0 end-0 m-3">
            <i className="bi bi-heart-fill text-danger"></i>
          </button>

          <div className="row g-4">
            {/* Product Image */}
            <div className="col-md-5 d-flex align-items-center justify-content-center bg-light rounded-start">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name || "Product Image"}
                className="img-fluid p-4"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>

            {/* Product Details */}
            <div className="col-md-7">
              <div className="p-3">
                <h2 className="fw-bold mb-2">{product.name}</h2>
                <p className="text-muted mb-1">
                  Brand: <strong>{product.brand}</strong> | Section: <strong>{product.section}</strong>
                </p>
                <p className="text-muted mb-1">
                  Rating: <strong>{product.rating} / 5</strong> | Stock: <strong>{product.stock}</strong>
                </p>

                {/* Rating Stars */}
                <div className="text-warning mb-3 fs-5">
                  {'★'.repeat(Math.max(0, Math.min(5, Math.floor(product.rating || 0))))}
                  {'☆'.repeat(Math.max(0, 5 - Math.floor(product.rating || 0)))}
                </div>

                {/* Color Options */}
                {product.colors?.length > 0 && (
                  <>
                    <p className="mb-1 text-muted">Color:</p>
                    <div className="d-flex gap-2 mb-3">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="rounded-circle border"
                          style={{
                            backgroundColor: color,
                            width: '25px',
                            height: '25px',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Size Selector */}
                {product.sizes?.length > 0 && (
                  <>
                    <p className="mb-1 text-muted">Size:</p>
                    <select className="form-select w-auto mb-4">
                      {product.sizes.map((size, index) => (
                        <option key={index} value={size}>{size}</option>
                      ))}
                    </select>
                  </>
                )}

                {/* Description */}
                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                  {product.description || "No description available."}
                </p>

                {/* Discount */}
                {product.discount > 0 && (
                  <p className="text-danger fw-semibold mb-2">
                    Discount: {product.discount}% OFF
                  </p>
                )}

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <p className="mb-2 text-muted">
                    Tags: {product.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">{tag}</span>
                    ))}
                  </p>
                )}

                {/* Reviews */}
                {product.reviews && (
                  <p className="text-muted mb-2">
                    <em>"{product.reviews}"</em>
                  </p>
                )}

                {/* Price and Actions */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    {product.discount > 0 && (
                      <small className="text-muted text-decoration-line-through me-2">
                        ₹{product.price.toFixed(2)}
                      </small>
                    )}
                    <h3 className="text-dark fw-bold mb-0 d-inline">₹{getDiscountedPrice()}</h3>
                  </div>

                  {/* Conditional Cart Buttons */}
                  <div className="d-flex gap-3">
                    {isInCart ? (
                      <>
                        <button className="btn btn-secondary px-4 rounded-3 shadow-sm" disabled>
                          In Cart
                        </button>
                      </>
                    ) : (
                      <button
                       className="btn btn-success px-4 rounded-3 shadow-sm"
  onClick={() => addToCart(product.id)}
>
  Add to Cart +
</button>

                    )}
                    <button className="btn btn-primary px-4 rounded-3 shadow-sm" onClick={()=>{buyNow(product.id)}}>
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
