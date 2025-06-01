"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/Components/Spinner";
import Popup from "@/Components/Popup";
import { useSellerOperations } from "@/context/SellerOperationsContext";

const Profile = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);

  const {
    userData,
    fetchUserData,
    updateProfileImage, // 🆕 from context
    loading,
  } = useSellerOperations();

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      updateProfileImage(base64Image); // 🔄 Use context method
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {loading && <Spinner />}
      {showPopup && <Popup message={"Logged out successfully!"} />}

      {!loading && (
        <div className="flex-grow-1 bg-light py-4">
          <div className="container">
            <div className="col-md-6 mx-auto">
              <div className="mb-3">
                <div className="card shadow mb-3 text-center d-flex justify-content-center align-items-center p-4 border-bottom">
                  <img
                    src={userData.image}
                    className="rounded-circle mb-3"
                    alt="User"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "3px solid #0d6efd",
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <h5 className="fw-semibold mb-1">{userData.name}</h5>
                  <p className="text-muted mb-0">{userData.role ?? "Seller"}</p>
                </div>
              </div>

              <div className="col-md-12">
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

                  <div className="mt-4">
                    <button className="btn btn-primary px-4" disabled>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
