import React from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ id, title, price, image, description }) { 
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents clicking the button from opening the product page
    addToCart({ id, title, price, image, description, quantity: 1 }) 
  }

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevents clicking the button from opening the product page
    addToCart({ id, title, price, image, description, quantity: 1 }) 
    navigate('/checkout')
  }

  return (
    <div className="border rounded-xl shadow-sm bg-white h-full flex flex-col overflow-hidden group">
      {/* ✅ CLICKABLE WRAPPER STARTS HERE */}
      <div 
        onClick={() => navigate(`/product/${id}`)} 
        className="cursor-pointer flex flex-col flex-grow"
      >
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-2">
          <img
            src={image || 'https://via.placeholder.com/150'}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="p-2 md:p-4 flex flex-col flex-grow">
          <h3 className="text-xs md:text-lg font-bold line-clamp-2 h-8 md:h-12 mb-1 group-hover:text-pmorange transition-colors">
            {title}
          </h3>
          
          <p className="text-xs md:text-lg text-gray-800 line-clamp-2 mb-2 leading-tight">
            {description}
          </p>

          <p className="text-pmorange font-bold text-sm md:text-xl mb-2">
            {price}
          </p>
        </div>
      </div>
      {/* ✅ CLICKABLE WRAPPER ENDS HERE */}

      <div className="p-2 md:p-4 pt-0 mt-auto">
        <div className="flex flex-col gap-1.5">
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
