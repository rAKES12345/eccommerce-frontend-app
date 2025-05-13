"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Carousel = () => {
    const images=["c1.jpg","c2.jpg","c3.jpg"];
    const [currentIndex,setCurrentIndex]=useState(1);


    useEffect(()=>{
        const timer=setTimeout(()=>{
            setCurrentIndex((prevIndex)=>(prevIndex+1) % images.length)
        },2000)
    },[currentIndex]);

  return (
    <div>
        <Image 
        src={`/images/${images[currentIndex]}`}
        alt="Banner"
        width={1200}
        height={500}
        layout="responsive"  
        priority     
        />
    </div>
  )
}

export default Carousel