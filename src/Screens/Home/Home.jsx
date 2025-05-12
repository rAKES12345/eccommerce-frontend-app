"use client"
import Carousel from '@/Components/Carousel'
import Footer from '@/Components/Footer'
import Item from '@/Components/Item'
import Navbar from '@/Components/Navbar/Navbar'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [products,setProducts]=useState([]);
  useEffect( ()=>{
    const fetchProducts=async()=>{
    try{
      const response=await fetch("https://fakestoreapi.in/api/products")
      const data=await response.json();
      console.log(data.products)
      setProducts(data.products);
    }catch(e){
      console.log(e)
    }
  }
  fetchProducts();
  },[])
  return (
    <div>
      <Navbar />
      <Carousel />
      <Item products={products} />
      <Footer />
    </div>
  )
}

export default Home