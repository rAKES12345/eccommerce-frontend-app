import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const SellerOperationsContext = createContext();

const baseUrl = "https://ecommerce-0zde.onrender.com";

export const SellerOperationsProvider = ({ children }) => {
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "https://via.placeholder.com/100",
  });

  // DASHBOARD METRICS
  const fetchDashboardData = async () => {
    try {
      const sellerUserCookie = Cookies.get("sellerUser");
      if (!sellerUserCookie) return;

      const sellerUser = JSON.parse(sellerUserCookie);
      if (sellerUser.role !== "seller") return;

      const sellerName = sellerUser.username;
      if (!sellerName) return;

      const sellerRes = await axios.post(`${baseUrl}/seller/getsellerdetailsbyname`, {
        name: sellerName,
      });

      const id = sellerRes.data?.id;
      if (!id) {
        console.error("Seller ID not found.");
        return;
      }

      const orderRes = await axios.post(`${baseUrl}/order/totalsellersorders`, {
        sellerId: id,
      });
      setTotalOrders(orderRes.data);

      const productRes = await axios.post(`${baseUrl}/item/totalsellersproducts`, {
        sellerId: id,
      });
      setTotalProducts(productRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setTotalOrders("Error");
      setTotalProducts("Error");
    }
  };

  // FETCH SELLER ORDERS
  const fetchSellerOrders = async () => {
    try {
      const sellerUserCookie = Cookies.get("sellerUser");
      if (!sellerUserCookie) return;

      const sellerUser = JSON.parse(sellerUserCookie);
      if (sellerUser.role !== "seller") return;

      const sellerName = sellerUser.username;
      if (!sellerName) return;

      const sellerRes = await axios.post(`${baseUrl}/seller/getsellerdetailsbyname`, {
        name: sellerName,
      });

      const id = sellerRes.data?.id;
      if (!id) return;

      const orderRes = await axios.post(`${baseUrl}/order/getbysellerorders`, {
        sellerId: id,
      });

      setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      setOrders([]);
    }
  };

  // MARK ORDER AS SHIPPED
  const makeShipment = async (orderId) => {
    try {
      await axios.post(`${baseUrl}/order/updateorderstatus`, {
        orderId,
        status: "SHIPPED",
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "SHIPPED" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // FETCH SELLER ID & PRODUCTS
  const fetchSellerIdAndProducts = async () => {
    try {
      setLoading(true);

      const sellerUserCookie = Cookies.get("sellerUser");
      if (!sellerUserCookie) throw new Error("User not logged in");

      const sellerUser = JSON.parse(sellerUserCookie);
      const username = sellerUser.username;
      if (!username) throw new Error("Username not found");

      const sellerRes = await axios.post(`${baseUrl}/item/getselleridbyname`, {
        name: username,
      });

      const id = sellerRes.data?.sellerId;
      if (!id) throw new Error("Seller ID not found");

      setSellerId(id);

      const productsRes = await axios.post(`${baseUrl}/item/getitemsbysellerid`, {
        sellerId: id,
      });

      setProducts(productsRes.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching seller ID or products:", err);
      setError(err.message || "Error fetching products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${baseUrl}/item/delete`, {
        data: { id: productId, sellerId },
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data);

      setProducts((prev) =>
        prev.filter((p) => p.id !== productId && p._id !== productId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Try again later.");
    }
  };

  // UPDATE PROFILE IMAGE
  const updateProfileImage = async (base64Image) => {
    try {
      const sellerUserCookie = Cookies.get("sellerUser");
      if (!sellerUserCookie) throw new Error("User not logged in");

      const sellerUser = JSON.parse(sellerUserCookie);
      const userName = sellerUser.username;

      await axios.post(`${baseUrl}/seller/addprofile`, {
        name: userName,
        image: base64Image,
      });

      setUserData((prev) => ({ ...prev, image: base64Image }));
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image.");
    }
  };

  // FETCH USER PROFILE DATA
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const sellerUserCookie = Cookies.get("sellerUser");
      if (!sellerUserCookie) throw new Error("User not logged in");

      const sellerUser = JSON.parse(sellerUserCookie);
      const userName = sellerUser.username;

      const res = await axios.post(`${baseUrl}/seller/getsellerdetailsbyname`, {
        name: userName,
      });

      const data = res.data;
      setUserData({
        name: data.name,
        email: data.email,
        phone: data.phone ?? "9********",
        image: data.image ?? "https://via.placeholder.com/100",
      });
      setError(null);
    } catch (e) {
      console.error("Error fetching user data:", e);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // GET SELLER ID BY NAME (for external use)
  const getSellerIdByName = async (sellerName) => {
    const res = await axios.post(
      `${baseUrl}/item/getselleridbyname`,
      { name: sellerName },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.sellerId;
  };

  // ADD NEW PRODUCT (for external use)
  const addNewProduct = async (productData) => {
    const res = await axios.post(
      `${baseUrl}/item/add`,
      productData,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  };

  // INITIAL DASHBOARD LOAD
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <SellerOperationsContext.Provider
      value={{
        totalOrders,
        totalProducts,
        orders,
        products,
        sellerId,
        loading,
        error,
        userData,
        fetchUserData,
        fetchDashboardData,
        fetchSellerOrders,
        fetchSellerIdAndProducts,
        makeShipment,
        handleDelete,
        updateProfileImage,
        getSellerIdByName,
        addNewProduct,
      }}
    >
      {children}
    </SellerOperationsContext.Provider>
  );
};

// Custom Hook
export const useSellerOperations = () => {
  const context = useContext(SellerOperationsContext);
  if (!context) {
    throw new Error("useSellerOperations must be used within a SellerOperationsProvider");
  }
  return context;
};
