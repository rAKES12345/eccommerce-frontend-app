"use client"
import React, { useState } from 'react'
import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar/Navbar'
import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import Popup from '@/Components/Popup';

const Profile = () => {
      const { logout } = useAuth();
      const router=useRouter();
      const [showPopup,setShowPopup]=useState(false);
  const user = {
    name: 'Rakesh Kakaraparthi',
    email: 'rakeshkakaraparthi232@gmail.com',
    phone: '9014322364',
    address: '123, Street Name, Hyderabad, Telangana, 500001',
  };

  const logoutMethod=()=>{
    logout(); 
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setShowPopup(!showPopup);
    router.push("/bhome"); 

  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
        {showPopup && <Popup message={"Logged out successfully !"} />}
      <div className="flex-grow-1 bg-light py-4">
        <div className="container">
          <div className="row">

            <div className="col-md-3 mb-3">
              <div className="border-0 h-100">
                <div className="card shadow mb-3 text-center d-flex justify-content-center align-items-center p-4 border-bottom">
                  <img
                    src="https://via.placeholder.com/100"
                    className="rounded-circle mb-3"
                    alt="User"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                  />
                  <h5 className="fw-semibold mb-1">{user.name}</h5>
                  <p className="text-muted mb-0">Customer</p>
                </div>

                <div className=" card shadow p-3 d-flex flex-column gap-2">
                  <button className="btn btn-outline-primary text-start">👤 Profile</button>
                  <button className="btn btn-outline-primary text-start">📦 My Orders</button>
                  <button className="btn btn-outline-primary text-start">🏠 Address</button>
                  <button className="btn btn-outline-danger text-start mt-3" onClick={logoutMethod}>⏻ Logout</button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <div className="card shadow border-0 p-4 h-100">
                <h4 className="mb-4 fw-bold">👤 Profile Information</h4>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <div className="form-control bg-white">{user.email}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <div className="form-control bg-white">{user.phone}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <div className="form-control bg-white">{user.address}</div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary px-4">Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile
