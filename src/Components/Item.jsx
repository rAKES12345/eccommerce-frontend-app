import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Item = ({ products }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartList');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
    }
  }, []);

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem('cartList', JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      return updatedCart;
    });
  };

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="text-center my-5 fs-4 text-muted">No products found.</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Featured Products</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {products.map((product, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm border-0 product-card">
              <div className="position-relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top p-3"
                  style={{ height: '230px', objectFit: 'contain' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-semibold" title={product.title}>
                  {product.title.length > 50
                    ? product.title.slice(0, 50) + '...'
                    : product.title}
                </h6>
                <p className="card-text small text-muted">{product.category}</p>
                <div className="mt-auto">
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                    ${product.price}
                  </span>
                </div>
                <button
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
};

export default Item;
