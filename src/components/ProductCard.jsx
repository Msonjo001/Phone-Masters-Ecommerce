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

  return (
    <div className="border rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
          }}
        />
      ) : (
        <img
          src="https://via.placeholder.com/150?text=No+Image"
          alt="No image"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
        <p className="text-pmorange font-medium">{price}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 px-3 py-2 text-sm bg-pmorange text-white rounded hover:bg-orange-500 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
