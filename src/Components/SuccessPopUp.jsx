import React from 'react'

const SuccessPopUp = ({ message, onClose }) => (
  <div className="position-fixed top-0 start-50 translate-middle-x mt-4 z-3">
    <div className="alert alert-success alert-dismissible fade show shadow" role="alert">
      <strong>Success!</strong> {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  </div>
);


export default SuccessPopUp