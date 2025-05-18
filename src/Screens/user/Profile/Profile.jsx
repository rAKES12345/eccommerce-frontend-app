"use client";
import React, { useEffect, useState, useRef } from 'react';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar/Navbar';
import Popup from '@/Components/Popup';
import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '@/Components/Spinner';

const Profile = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "https://via.placeholder.com/100"
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userName = localStorage.getItem("userName");

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:9091/user/getuserdetailsbyname", { name: userName });
        const data = res.data;

        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "9********",
          address: data.address ?? "N/A",
          image: data.image ?? "https://via.placeholder.com/100"
        });
      } catch (e) {
        console.log("Error fetching user data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchUserData();
    }
  }, []);

  const logoutMethod = () => {
    logout();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setShowPopup(true);
    router.push("/bhome");
  };

  // Trigger hidden file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file select & upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userName = localStorage.getItem("userName");

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        await axios.post("http://localhost:9091/user/addprofile", {
          name: userName,
          image: base64Image
        });

        setUserData((prev) => ({ ...prev, image: base64Image }));
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Error uploading profile image:", error);
        alert("Failed to upload profile image.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {loading && <Spinner />}
      <Navbar />
      {showPopup && <Popup message={"Logged out successfully!"} />}
      <div className="flex-grow-1 bg-light py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="border-0 h-100">
                <div className="card shadow mb-3 text-center d-flex justify-content-center align-items-center p-4 border-bottom">
                  <img
                    src={userData.image}
                    className="rounded-circle mb-3"
                    alt="User"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #0d6efd', cursor: 'pointer' }}
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <h5 className="fw-semibold mb-1">{userData.name}</h5>
                  <p className="text-muted mb-0">Customer</p>
                </div>

                <div className="card shadow p-3 d-flex flex-column gap-2">
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
                  <div className="form-control bg-white">{userData.email}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <div className="form-control bg-white">{userData.phone}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <div className="form-control bg-white">{userData.address}</div>
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
  );
};

export default Profile;
