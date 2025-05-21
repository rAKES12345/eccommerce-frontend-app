import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">ShopEase</h5>
            <p>ShopEase is your one-stop destination for the best products online. We strive to provide an exceptional shopping experience with easy navigation, secure payment methods, and fast delivery.</p>
          </div>

          <div className="col-md-2">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-light text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className='d-flex'>
              <a href="#" className="text-light me-3"><FaFacebook size={24} /></a>
              <a href="#" className="text-light me-3"><FaTwitter size={24} /></a>
              <a href="#" className="text-light me-3"><FaInstagram size={24} /></a>
              <a href="#" className="text-light me-3"><FaLinkedin size={24} /></a>
            </div>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Registered Office Address</h5>
            <p>
              123 ShopEase Street,<br />
              Business Park, City,<br />
              Country - 123456
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-dark text-center text-light py-3 mt-4">
        <p className="mb-0">© 2025 ShopEase. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
