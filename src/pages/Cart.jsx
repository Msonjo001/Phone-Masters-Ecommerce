import React from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const total = cart.reduce((sum, item) => {
  // Safe check if price exists and is a string
  const priceString = String(item.price || "0");
  const numPrice = parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;
  return sum + numPrice;
}, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛍️</h2>
        <p className="text-gray-600">Browse the shop to add some items!</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-pmorange">{item.price}</p>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item.title)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-pmorange">KSh {total.toLocaleString()}</span>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={clearCart}
            className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 py-2 bg-pmorange text-white rounded hover:bg-orange-500"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
