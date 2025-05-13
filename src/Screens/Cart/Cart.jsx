"use client";
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartNavbar from '@/Components/CartNavbar';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage and sanitize them
  useEffect(() => {
    const savedCart = localStorage.getItem('cartList');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          const sanitizedCart = parsedCart.map(item => ({
            ...item,
            price: parseFloat(item.price),
            quantity: item.quantity ? parseInt(item.quantity, 10) : 1,
          }));
          setCartItems(sanitizedCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartList', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, action) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = action === 'increase'
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cartList', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item, index) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity;
      }
    });
    return total.toFixed(2); // formatted to 2 decimal places
  };

  return (
    <div>
      <CartNavbar />
      <div className="container my-5">
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">Your cart is empty!</div>
        ) : (
          <div>
            <div className="row">
              {cartItems.map((item) => (
                <div className="col-12 mb-3" key={item.id}>
                  <div className="card shadow-sm border-0">
                    <div className="row g-0">
                      <div className="col-md-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="img-fluid rounded-start"
                          style={{ height: '150px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="col-md-7">
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">Price: ${item.price}</p>
                          <p className="card-text">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>

                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary me-2"
                              onClick={() => updateQuantity(item.id, 'decrease')}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="btn btn-outline-secondary ms-2"
                              onClick={() => updateQuantity(item.id, 'increase')}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <h4>Total: ${getTotalPrice()}</h4>
              <button className="btn btn-success" onClick={() => alert('Proceed to Checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
