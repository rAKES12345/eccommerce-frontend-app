"use client"
import SellerNavbar from '@/Components/SellerNavbar'
import SellerSidebar from '@/Components/SellerSidebar'
import React from 'react'
import { useRouter } from 'next/navigation'

const Profile = () => {
  const router = useRouter();

  const sellerData = {
    firstName: "Rakesh",
    lastName: "Kakaraparthi",
    username: "rakesh.kakaraparthi",
    nickname: "Rocky",
    role: "Seller",
    email: "rakeshkakaraparthi232@gmail.com",
    mobile: "9014322364",
    whatsapp: "@rakesh",
    telegram: "@rakesh",
    website: "https://rakeshmart.com",
    businessName: "Rakesh Mart",
    gstNumber: "36AABCU9603R1Z2",
    storeAddress: "123, Madhapur, Hyderabad, Telangana, 500081",
    about: "Entrepreneur specializing in encrypted image platforms.",
    image: "https://via.placeholder.com/120" // Replace with actual profile image URL
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/seller/login");
  }

  return (
    <div>
      <SellerNavbar />
      <div className="d-flex" style={{ height: 'calc(100vh - 56px)' }}>
        <SellerSidebar />
         {/* Main Content */}
        <div className="flex-grow-1" style={{overflow:"auto"}}>
          <div className="p-4">
            <div className="container bg-white shadow p-4 rounded">
              <div className="row">
                {/* Profile Photo & Account Management */}
                <div className="col-md-4 text-center border-end">
                  <img
                    src={sellerData.image}
                    className="rounded-circle mb-3"
                    alt="profile"
                    style={{ width: "140px", height: "140px", objectFit: "cover" }}
                  />
                  <h5>{`${sellerData.firstName} ${sellerData.lastName}`}</h5>
                  <p className="text-muted">{sellerData.role}</p>

                  <button className="btn btn-outline-secondary w-100 mb-3">Upload Photo</button>

                  <div>
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Old Password"
                    />
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="New Password"
                    />
                    <button className="btn btn-primary w-100">Change Password</button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100 mt-4"
                  >
                    Logout
                  </button>
                </div>

                {/* Profile Info Form */}
                <div className="col-md-8">
                  <h5 className="mb-3">Profile Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.username}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Nickname</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.nickname}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.firstName}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.lastName}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        defaultValue={sellerData.email}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.mobile}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>WhatsApp</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.whatsapp}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Telegram</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.telegram}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Website</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.website}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.businessName}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>GST Number</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.gstNumber}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Store Address</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={sellerData.storeAddress}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label>About</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        defaultValue={sellerData.about}
                      />
                    </div>
                  </div>

                  <button className="btn btn-success mt-3">Save Changes</button>
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
