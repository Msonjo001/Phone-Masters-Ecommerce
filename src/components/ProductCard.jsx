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
return (
  <div className="border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col bg-white h-full">
    <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-2">
      <img
        src={image || 'https://via.placeholder.com/150'}
        alt={title}
        className="max-h-full max-w-full object-contain"
      />
    </div>

    <div className="p-2 md:p-4 flex flex-col flex-grow">
      <h3 className="text-xs md:text-lg font-bold line-clamp-2 h-8 md:h-12 mb-1">
        {title}
      </h3>
      <p className="text-pmorange font-bold text-sm md:text-xl mb-2">
        {price}
      </p>

      <div className="mt-auto flex flex-col gap-1.5">
        {/* ✅ ADD TO CART BUTTON RESTORED */}
        <button
          onClick={handleAddToCart}
          className="w-full py-1.5 text-[10px] md:text-sm bg-gray-100 text-gray-800 rounded-lg font-bold hover:bg-gray-200"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full py-1.5 text-[10px] md:text-sm bg-pmorange text-white rounded-lg font-bold"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
);
}
