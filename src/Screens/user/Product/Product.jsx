"use client";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar/Navbar';
import Spinner from '@/Components/Spinner';

const Product = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("selectedProduct");
    if (data) {
      setProduct(JSON.parse(data));
    }
  }, []);

  if (!product) {
    return <Spinner />
  }

  return (
    <div>
      <Navbar />
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-5 d-flex align-items-center justify-content-center bg-light">
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid p-4"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body p-5">
              <h3 className="card-title mb-3 fw-bold">{product.title}</h3>
              <p className="text-muted mb-2">Category: <strong>{product.category}</strong></p>
              <h4 className="text-success mb-4">${product.price}</h4>
              <p className="card-text" style={{ fontSize: '1.1rem' }}>
                {product.description || "No description available."}
              </p>
              <div className='d-flex gap-4'>
                <button className="btn btn-primary mt-3 px-4 py-2">
                Add to Cart
              </button>
              <button className="btn btn-warning mt-3 px-4 py-2">
                Buy now
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer />
      </div>
  );
};

export default Product;
