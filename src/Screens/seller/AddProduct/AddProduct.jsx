"use client";
import React, { useState, useEffect } from "react";
import { useSellerOperations } from "@/context/SellerOperationsContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Popup from "@/Components/Popup";

const AddProduct = () => {
  const {
    sellerId,
    addNewProduct,
    getSellerIdByName,
    fetchSellerIdAndProducts,
  } = useSellerOperations();

  const [product, setProduct] = useState({
    sellerId: "",
    name: "",
    price: "",
    section: "",
    description: "",
    rating: "",
    stock: "",
    brand: "",
    discount: "",
    tags: [],
    image: "",
  });

  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false); // For loading state

  useEffect(() => {
    if (!sellerId) {
      fetchSellerIdAndProducts();
    }
  }, [sellerId, fetchSellerIdAndProducts]);

  useEffect(() => {
    if (sellerId) {
      setProduct((prev) => ({ ...prev, sellerId }));
    }
  }, [sellerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setProduct({ ...product, tags: value.split(",").map((tag) => tag.trim()) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.sellerId) {
      alert("Seller ID not found, please try again.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await addNewProduct(product);
      console.log("Product added:", response);
      setShowPopUp(true);

      setProduct({
        sellerId,
        name: "",
        price: "",
        section: "",
        description: "",
        rating: "",
        stock: "",
        brand: "",
        discount: "",
        tags: [],
        image: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to add product. Try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="d-flex">
      <div className="container mt-4">
        {showPopUp && (
          <Popup
            message={"Product Added Successfully!"}
            onClose={() => setShowPopUp(false)}
          />
        )}
        <h3 className="mb-4">Add New Product</h3>
        <div className="row">
          <div
            className="col-md-6"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded shadow-sm"
            >
              {[
                { label: "Product Name", name: "name" },
                { label: "Section", name: "section" },
                { label: "Brand", name: "brand" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Price (₹)", name: "price", type: "number" },
                { label: "Rating (1–5)", name: "rating", type: "number" },
                { label: "Stock", name: "stock", type: "number" },
                { label: "Discount (%)", name: "discount", type: "number" },
                { label: "Tags (comma separated)", name: "tags" },
              ].map(({ label, name, type = "text" }) => (
                <div className="mb-3" key={name}>
                  <label className="form-label">{label}</label>
                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={product[name]}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                      required
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={product[name]}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Adding the product..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">{product.name || "Product Name"}</h5>
              {product.image && (
                <img
                  src={product.image}
                  alt="Preview"
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Section:</strong> {product.section}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Discount:</strong> {product.discount}%</p>
              <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
