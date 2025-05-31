'use client';
import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "@/Components/Spinner";
import { useRouter } from "next/navigation";
import { useUserOperations } from "@/context/UserOperationsContext";

const Cart = () => {
  const router = useRouter();
  const {
    user,
    cartItems,
    loadingCart,
    fetchCartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    searchItem,
  } = useUserOperations();

  useEffect(() => {
    if (user?.username) {
      fetchCartItems(user.username);
    }
  }, [user, fetchCartItems]);

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
      {loadingCart ? (
        <Spinner />
      ) : filteredProducts.length === 0 ? (
        <p className="text-center fs-5">Your cart is empty</p>
      ) : (
        <>
          <div className="row g-3">
            {filteredProducts.map((item, ind) => (
              <div
                key={ind}
                className="col-12"
                onClick={() => openProduct(item)}
                style={{ cursor: item.stock > 0 ? "pointer" : "not-allowed" }}
                aria-disabled={item.stock <= 0}
              >
                <div className="card shadow-sm border-0">
                  <div className="row g-0 align-items-center">
                    {/* Image */}
                    <div className="col-12 col-md-3 d-flex justify-content-center p-3">
                      <img
                        src={item.image || item.thumbnail || "/default.jpg"}
                        alt={item.name || "Product Image"}
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px", objectFit: "contain", width: "auto" }}
                      />
                    </div>

                    {/* Details */}
                    <div className="col-12 col-md-7 p-3">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text mb-1">
                        Price: ₹{parseFloat(item.price).toFixed(2)}
                      </p>
                      <p className="card-text mb-2">
                        Subtotal: ₹
                        {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <p className="card-text mb-1">Description: {item.description}</p>

                      {/* Quantity controls */}
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.quantity > 1) updateQuantity(item.id, "decrease");
                          }}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="px-2 fw-bold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, "increase");
                          }}
                          aria-label={`Increase quantity of ${item.name}`}
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
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Checkout */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
            <h4 className="m-0">Total: ₹{getTotalPrice()}</h4>
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
