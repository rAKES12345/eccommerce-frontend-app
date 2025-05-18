import SellerNavbar from '@/Components/SellerNavbar'
import SellerSidebar from '@/Components/SellerSidebar'
import React from 'react'

const Orders = () => {
  return (
    <div>
      <SellerNavbar />
      <div className='d-flex'>
        <SellerSidebar />
        <div className='main'>Orders</div>
      </div>
    </div>
  )
}

export default Orders