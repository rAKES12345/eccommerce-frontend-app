'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Popup from '@/Components/Popup';
import Spinner from '@/Components/Spinner';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user, logout, getUserDetails, addProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.username) return;
      setLoading(true);
      try {
        const data = await getUserDetails(user.username);
        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone ?? '9********',
          address: data.address ?? 'N/A',
          image: data.image ?? 'https://via.placeholder.com/100',
        });
      } catch (err) {
        console.error('Error loading user data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const logoutHandler = () => {
    logout();
    setShowPopup(true);
    router.push('/home');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.username) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        await addProfile(user.username, base64Image);
        setUserData((prev) => ({ ...prev, image: base64Image }));
        alert('Profile image updated successfully!');
      } catch (err) {
        console.error('Error uploading image:', err.message);
        alert('Image upload failed.');
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !userData) return <Spinner />;

  return (
    <div className="d-flex flex-column">
      {showPopup && <Popup message="Logged out successfully!" />}
      <div className="flex-grow-1 bg-light py-4">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 mb-3">
              <div className="card shadow text-center p-4 border-bottom">
                <img
                  src={userData.image}
                  alt="User"
                  onClick={handleImageClick}
                  className="rounded-circle mb-3"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    border: '3px solid #0d6efd',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <h5 className="fw-semibold mb-1">{userData.name}</h5>
                <p className="text-muted mb-0">{user?.role}</p>
              </div>

              <div className="card shadow p-3 d-flex flex-column gap-2">
                <button className="btn btn-outline-primary text-start">👤 Profile</button>
                <button className="btn btn-outline-primary text-start">📦 My Orders</button>
                <button className="btn btn-outline-primary text-start">🏠 Address</button>
                <button className="btn btn-outline-danger text-start mt-3" onClick={logoutHandler}>⏻ Logout</button>
              </div>
            </div>

            {/* Main content */}
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
    </div>
  );
};

export default Profile;
