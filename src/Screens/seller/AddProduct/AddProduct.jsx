"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SellerNavbar from "@/Components/SellerNavbar";
import SellerSidebar from "@/Components/SellerSidebar";
import Popup from "@/Components/Popup";

const AddProduct = () => {
  const [product, setProduct] = useState({
    sellerId:"",
    name: "",
    price: "",
    section: "",
    description: "",
    rating: "",
    stock: "",
    brand: "",
    discount: "",
    tags: [],
    image: ""
  });

  const [showPopUp,setShowPopUp]=useState(false);

  useEffect(() => {
    const fetchSellerId = async () => {
      const role = localStorage.getItem("role");
      if (role === "seller") {
        const sellerName = localStorage.getItem("userName");
        try {
          const res = await axios.post(
            "http://localhost:9091/item/getselleridbyname",
            { name: sellerName },  // JSON body
            { headers: { "Content-Type": "application/json" } }
          );
          if (res.data.sellerId) {
            setProduct(prev => ({ ...prev, sellerId: res.data.sellerId }));
          }
        } catch (error) {
          console.error("Error fetching sellerId:", error);
        }
      }
    };

    fetchSellerId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setProduct({ ...product, tags: value.split(",").map(tag => tag.trim()) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct(prev => ({ ...prev, image: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitted Product:", product);
    const res = await axios.post("http://localhost:9091/item/add", product, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", res.data);

    // Reset form but keep sellerId
    setShowPopUp(!showPopUp);
    setProduct({
      sellerId: product.sellerId,
      name: "",
      price: "",
      section: "",
      description: "",
      rating: "",
      stock: "",
      brand: "",
      discount: "",
      tags: [],
      image: ""
    });
  } catch (error) {
    console.error("Error submitting product:", error);
  }
};



  return (
    
    <div>
      <SellerNavbar />
      <div className="d-flex">
        <SellerSidebar />
        <div className="container mt-4">
          {showPopUp && <Popup message={"Product Added Successfully !"} onClose={()=>{setShowPopUp(!showPopUp)}} />}
          <h3 className="mb-4">Add New Product</h3>
          <div className="row">
            
            <div className="col-md-6" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
                {[
                  { label: "Product Name", name: "name" },
                  { label: "Section", name: "section" },
                  { label: "Brand", name: "brand" },
                  { label: "Description", name: "description", type: "textarea" },
                  { label: "Price (₹)", name: "price", type: "number" },
                  { label: "Rating (1–5)", name: "rating", type: "number" },
                  { label: "Stock", name: "stock", type: "number" },
                  { label: "Discount (%)", name: "discount", type: "number" },
                  { label: "Tags (comma separated)", name: "tags" }
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
                  <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary w-100">Add Product</button>
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
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
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
    </div>
  );
};

export default AddProduct;
