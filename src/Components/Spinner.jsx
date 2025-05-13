"use client";
import React from "react";

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light flex-column">
      <div
        className="spinner-border text-primary spinner-lg shadow"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-4 fs-5 text-muted">Fetching product details...</p>

      <style jsx>{`
        .spinner-lg {
          animation: fadeIn 1s ease-in-out infinite;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.3;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
