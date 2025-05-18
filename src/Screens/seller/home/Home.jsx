"use client";
import React, { useState } from 'react';
import Footer from '@/Components/Footer';
import SellerDashBoard from '@/Components/SellerDashBoard';
import SellerNavbar from '@/Components/SellerNavbar';
import SellerSidebar from '@/Components/SellerSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Addproduct from '@/Screens/seller/AddProduct/AddProduct';
import Products from '@/Screens/seller/Products/Products';
import Orders from '@/Screens/seller/Orders/Orders';

const Home = () => {
  
  return (
   <SellerDashBoard />
  );
};

export default Home;
