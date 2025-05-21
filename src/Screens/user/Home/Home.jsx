"use client"
import Carousel from '@/Components/Carousel'
import Footer from '@/Components/Footer'
import Item from '@/Components/Item'
import Navbar from '@/Components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9091/item/all");
        setProducts(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <Carousel />
      <Item products={products} />
    </div>
  );
}

export default Home;
