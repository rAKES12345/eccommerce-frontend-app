"use client";
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import CartNavbar from "@/Components/CartNavbar";
import axios from "axios";
import Spinner from "@/Components/Spinner";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const dummyName = localStorage.getItem("userName");
    if (dummyName) setName(dummyName);
  }, []);

  useEffect(() => {
    if (!name) return;

    const fetchCartItems = async () => {
      try {
        const cartRes = await axios.post("http://localhost:9091/cart/userscarts", { name });

        if (Array.isArray(cartRes.data)) {
          const itemIds = cartRes.data;

          const itemDetails = await Promise.all(
            itemIds.map(async (itemId) => {
              const res = await axios.post("http://localhost:9091/item/getitembyid", {
                id: itemId,
              });
              return res.data;
            })
          );

          setCartItems(itemDetails);
        }
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      }
    };

    fetchCartItems();
  }, [name]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete("http://localhost:9091/cart/delete", {
        data: { name, itemId },
      });
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const updateQuantity = (id, action) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity =
          action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 1;
        return acc + price * quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div>
      <CartNavbar />
      <div className="container my-5">
        {cartItems.length === 0 ? (
          <Spinner />
        ) : (
          <>
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
                          style={{ height: "150px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-7">
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">Price: ${item.price}</p>
                          <p className="card-text">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary me-2"
                              onClick={() => updateQuantity(item.id, "decrease")}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="btn btn-outline-secondary ms-2"
                              onClick={() => updateQuantity(item.id, "increase")}
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
              <button className="btn btn-success" onClick={() => alert("Proceed to Checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
