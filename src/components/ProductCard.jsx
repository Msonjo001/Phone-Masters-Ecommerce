import React from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ id, title, price, image, description }) { // ✅ include id
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    addToCart({ id, title, price, image, quantity: 1 }) // ✅ pass id to cart
  }

  const handleBuyNow = () => {
    addToCart({ id, title, price, image, quantity: 1 }) // ✅ pass id
    navigate('/checkout')
  }

  // REPLACE your ProductCard.jsx return with this:
rreturn (
  <div className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col bg-white">
    <div className="aspect-square w-full bg-gray-50">
      <img
        src={image || 'https://via.placeholder.com/150'}
        alt={title}
        className="w-full h-full object-contain p-2"
      />
    </div>

    <div className="p-2 md:p-4">
      {/* Smaller text for mobile */}
      <h3 className="text-xs md:text-lg font-semibold line-clamp-2 h-8 md:h-12">
        {title}
      </h3>
      <p className="text-pmorange font-bold text-sm md:text-base mt-1">
        {price}
      </p>

      <div className="mt-3 flex flex-col gap-1.5">
        <button
          onClick={handleBuyNow}
          className="w-full py-2 text-[10px] md:text-sm bg-pmorange text-white rounded font-bold"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
);
}
