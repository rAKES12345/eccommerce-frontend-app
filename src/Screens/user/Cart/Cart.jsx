'use client';
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Spinner from "@/Components/Spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
    const { searchItem, setSearchItem } = useAuth();


  useEffect(() => {
    const dummyName = localStorage.getItem("userName");
    if (dummyName) setName(dummyName);
  }, []);

  useEffect(() => {
    if (!name) return;

    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const cartRes = await axios.post("http://localhost:9091/cart/userscarts", { name });

        if (Array.isArray(cartRes.data)) {
          const itemIds = cartRes.data;

          const itemDetails = await Promise.all(
            itemIds.map(async (itemId) => {
              const res = await axios.post("http://localhost:9091/item/getitembyid", {
                id: itemId,
              });
              return { ...res.data, quantity: res.data.quantity ?? 1 };
            })
          );

          setCartItems(itemDetails);
        }
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [name]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete("http://localhost:9091/cart/delete", {
        data: { name, itemId },
      });
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const updateQuantity = (id, action) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const currentQuantity = parseInt(item.quantity) || 1;
        const newQuantity = action === "increase" ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
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
        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        return acc + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const openProduct = (product) => {
    if (product.stock <= 0) return;

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    router.push(`/product`);
  };

  const filteredProducts = cartItems.filter((product) => {
    if (!searchItem || searchItem.trim() === "") return true;
    const query = searchItem.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.section?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });


  return (
    <div className="container my-5">
      {loading ? (
        <Spinner />
      ) : cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="row g-3">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="col-12"
                onClick={() => openProduct(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm border-0">
                  <div className="row g-0 align-items-center">
                    {/* Image section */}
                    <div className="col-12 col-md-3 d-flex justify-content-center p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "150px",
                          objectFit: "contain",
                          width: "auto",
                        }}
                      />
                    </div>

                    {/* Details section */}
                    <div className="col-12 col-md-7 p-3">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text mb-1">Price: ${item.price}</p>
                      <p className="card-text mb-2">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="card-text mb-1">Description: {item.description}</p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, "decrease");
                          }}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, "increase");
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="col-12 col-md-2 d-flex justify-content-center align-items-center p-3">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Checkout */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
            <h4 className="m-0">Total: ${getTotalPrice()}</h4>
            <button
              className="btn btn-success px-4"
              onClick={() => alert("Proceed to Checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
