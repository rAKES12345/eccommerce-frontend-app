"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const UserOperationsContext = createContext();

export const UserOperationsProvider = ({ children }) => {
  const router = useRouter();

  // Product and order states
  const [product, setProduct] = useState(null);
  const [order, setOrder] = useState({
    itemId: "",
    name: "",
    address: "",
    sellerId: "",
    paymentMethod: "Cash on Delivery",
  });

  // User and cart states
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);

  // Store just IDs in a Set
  const [cartIds, setCartIds] = useState(new Set());

  // Detailed cart items with quantities, prices, etc.
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Orders and items states
  const [orders, setOrders] = useState([]);
  const [itemsData, setItemsData] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Optional search filter for orders
  const [searchItem, setSearchItem] = useState("");

  // Initialize user info from cookie "user" (JSON string)
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        const parsedUser = JSON.parse(cookieUser);
        setUserName(parsedUser.username);
        setRole(parsedUser.role);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, []);

  // Fetch cart item IDs for logged in user
  const fetchCartIds = async (name) => {
    if (!name) return;
    try {
      const response = await axios.post(
        "https://ecommerce-0zde.onrender.com/cart/userscarts",
        { name }
      );
      const itemIds = response.data;
      if (Array.isArray(itemIds)) {
        setCartIds(new Set(itemIds.map(String)));
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  // Fetch full cart item details by IDs and add quantity = 1 if missing
  const fetchCartItems = useCallback(async () => {
    if (cartIds.size === 0) {
      setCartItems([]);
      return;
    }

    setLoadingCart(true);
    try {
      const itemsArray = Array.from(cartIds);
      const detailedItems = await Promise.all(
        itemsArray.map(async (itemId) => {
          const res = await axios.post(
            "https://ecommerce-0zde.onrender.com/item/getitembyid",
            { id: itemId }
          );
          return {
            ...res.data,
            quantity: res.data.quantity ? Number(res.data.quantity) : 1,
          };
        })
      );
      setCartItems(detailedItems);
    } catch (error) {
      console.error("Error fetching detailed cart items:", error);
    } finally {
      setLoadingCart(false);
    }
  }, [cartIds]);

  // When userName changes, fetch cart item IDs automatically
  useEffect(() => {
    if (userName) {
      fetchCartIds(userName);
    } else {
      setCartIds(new Set()); // clear cart if no user
      setCartItems([]);
    }
  }, [userName]);

  // When cartIds changes, fetch detailed cart items
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Add to cart method (only id param, userName taken from state)
  const addToCartMethod = async (id) => {
    if (!userName) {
      router.push("/login");
      return { success: false, message: "User not logged in" };
    }

    try {
      const response = await axios.post("https://ecommerce-0zde.onrender.com/cart/add", {
        name: userName,
        itemId: id,
      });

      if (response.status === 200) {
        setCartIds((prev) => new Set(prev).add(String(id)));
        return { success: true };
      } else {
        return { success: false, message: "Failed to add to cart." };
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || error.message || "Unknown error" };
    }
  };

  // Remove item from cart (by itemId)
  const removeFromCart = async (itemId) => {
    if (!userName) return;
    try {
      await axios.delete("https://ecommerce-0zde.onrender.com/cart/delete", {
        data: { name: userName, itemId },
      });
      setCartIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(String(itemId));
        return newSet;
      });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  // Update quantity for an item
  const updateQuantity = async (id, action) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentQuantity = parseInt(item.quantity) || 1;
          const newQuantity =
            action === "increase"
              ? currentQuantity + 1
              : Math.max(1, currentQuantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // Send update to backend
    try {
      const updatedItem = cartItems.find((item) => item.id === id);
      if (!updatedItem) return;

      const newQuantity =
        action === "increase"
          ? (updatedItem.quantity || 1) + 1
          : Math.max(1, (updatedItem.quantity || 1) - 1);

      await axios.post("https://ecommerce-0zde.onrender.com/cart/updatequantity", {
        name: userName,
        itemId: id,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  // Calculate total price of cart items
  const getTotalPrice = () => {
    return cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        return acc + price * quantity;
      }, 0)
      .toFixed(2);
  };

  // Load product data for Buy Now page
  const fetchItemData = async () => {
    try {
      const id = localStorage.getItem("buyNowProductId");
      if (!id) return;

      const res = await axios.post("https://ecommerce-0zde.onrender.com/item/getitembyid", {
        id,
      });

      const item = res.data;
      setProduct(item);
      setOrder((prev) => ({
        ...prev,
        itemId: item.id,
        sellerId: item.sellerId,
      }));
    } catch (e) {
      console.error("Error fetching product:", e);
    }
  };

  // Place order (Buy Now)
  const buyNow = async (orderDetails) => {
    if (!userName) {
      router.push("/login");
      return { success: false, message: "User not logged in" };
    }

    try {
      const res = await axios.post("https://ecommerce-0zde.onrender.com/order/add", orderDetails);
      router.push("/");
      return { success: true };
    } catch (e) {
      console.error("Order error:", e);
      return { success: false, error: e.response?.data || e.message };
    }
  };

  // Optional helper to update order partially
  const updateOrder = (newData) => {
    setOrder((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Set user info in cookies and state (if needed)
  const setUserInfo = (name, userRole) => {
    Cookies.set("user", JSON.stringify({ username: name, role: userRole }), { expires: 7 });
    setUserName(name);
    setRole(userRole);
  };

  // Clear user info and cart
  const clearUserInfo = () => {
    Cookies.remove("user");
    setUserName(null);
    setRole(null);
    setCartIds(new Set());
    setCartItems([]);
    setOrders([]);
    setItemsData({});
  };

  // New method: fetch orders for user + fetch all related item details
  const fetchOrdersForUser = useCallback(
    async (name) => {
      if (!name) return;
      setLoadingOrders(true);
      try {
        // Fetch user's orders
        const res = await axios.post(
          "https://ecommerce-0zde.onrender.com/order/getusersorders",
          { name }
        );
        const userOrders = res.data || [];
        setOrders(userOrders);

        // Fetch item details for each order's itemId
        const itemRequests = userOrders.map((order) =>
          axios.post("https://ecommerce-0zde.onrender.com/item/getitembyid", {
            id: order.itemId,
          })
        );

        const itemsResponses = await Promise.all(itemRequests);

        // Map items by id for easy lookup
        const itemsMap = {};
        itemsResponses.forEach((response) => {
          if (response.data && response.data.id) {
            itemsMap[response.data.id] = response.data;
          }
        });

        setItemsData(itemsMap);
      } catch (error) {
        console.error("Error fetching user orders and items:", error);
        setOrders([]);
        setItemsData({});
      } finally {
        setLoadingOrders(false);
      }
    },
    []
  );

  const openOrder = (order) => {
    Cookies.set("selectedOrderId", order.id, { expires: 1 }); // expires in 1 day
    router.push("/orderDetails");
  };

  const loadOrderData = async () => {
  const orderId = Cookies.get("selectedOrderId");
  if (!orderId) return null;

  try {
    const orderRes = await axios.post("https://ecommerce-0zde.onrender.com/order/getorderbyid", { id: orderId });
    const order = orderRes.data;

    const [itemRes, sellerRes] = await Promise.all([
      axios.post("https://ecommerce-0zde.onrender.com/item/getitembyid", { id: order.itemId }),
      axios.post("https://ecommerce-0zde.onrender.com/seller/getsellerdetailsbyid", { id: order.sellerId }),
    ]);

    return {
      order,
      item: itemRes.data,
      seller: sellerRes.data,
    };
  } catch (err) {
    console.error("Error loading order data:", err);
    return null;
  }
}
  // When userName changes, fetch their orders as well
  useEffect(() => {
    if (userName) {
      fetchOrdersForUser(userName);
    } else {
      setOrders([]);
      setItemsData({});
    }
  }, [userName, fetchOrdersForUser]);

  return (
    <UserOperationsContext.Provider
      value={{
        product,
        setProduct,
        order,
        setOrder: updateOrder,
        updateOrder,
        userName,
        role,
        cartIds,
        cartItems,
        loadingCart,
        addToCartMethod,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        fetchCartItems,
        fetchItemData,
        buyNow,
        setUserInfo,
        clearUserInfo,
        orders,
        itemsData,
        loadingOrders,
        fetchOrdersForUser,
        searchItem,
        setSearchItem,
        openOrder,
        loadOrderData
      }}
    >
      {children}
    </UserOperationsContext.Provider>
  );
};

export const useUserOperations = () => useContext(UserOperationsContext);
