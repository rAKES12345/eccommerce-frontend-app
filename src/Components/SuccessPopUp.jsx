import React from 'react';

const SuccessPopup = ({ show, onClose }) => {
  if (!show) return null;

  // Auto close handled by parent component's timer

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
      onClick={onClose} // Close on clicking outside the popup box
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "2rem 3rem",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          minWidth: "300px",
          cursor: "default",
        }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        <div
          style={{
            fontSize: "4rem",
            color: "green",
            marginBottom: "1rem",
          }}
        >
          &#10003;
        </div>
        <h4>Order placed successfully!</h4>
      </div>
    </div>
  );
};

export default SuccessPopup;
