import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';

const Popup = ({ message, onClose }) => {
  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x mb-4"
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-white d-flex justify-content-between align-items-center rounded shadow p-3 border"
        style={{ minWidth: '300px', maxWidth: '500px' }}
      >
        <p className="mb-0 me-3 text-dark">{message}</p>
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Popup;
