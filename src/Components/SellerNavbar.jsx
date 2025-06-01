"use client";

import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

const SellerNavbar = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sellerUserCookie = Cookies.get("sellerUser");
    if (sellerUserCookie) {
      try {
        const sellerUser = JSON.parse(sellerUserCookie); // parse JSON string to object
        setUsername(sellerUser.username || sellerUser.name || ""); // adapt key as per your backend response
      } catch (e) {
        console.warn("Failed to parse sellerUser cookie:", e);
        setUsername("");
      }
    }
  }, []);

  const handleProfileClick = () => {
    const role = Cookies.get("role") || "seller"; // fallback to seller because this navbar is for sellers
    if (role === "seller") {
      router.push("/seller/profile");
    } else if (role === "deliverer") {
      router.push("/deliverer/profile");
    } else {
      router.push("/"); // fallback
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4"
      style={{ height: "60px" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold fs-4" style={{ color: "#2c3e50" }}>
          Synkart
        </Link>

        <div
          className="d-flex align-items-center gap-2"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleProfileClick();
            }
          }}
        >
          <FaUserCircle size={28} color="#4a4a4a" />
          <span
            className="ms-2 fw-semibold"
            style={{
              fontSize: "1.1rem",
              color: "#34495e",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {username || "Guest"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;
