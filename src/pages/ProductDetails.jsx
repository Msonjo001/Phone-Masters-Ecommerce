import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        navigate("/shop");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20">Loading phone details...</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Grid: Stacks on mobile, side-by-side on desktop */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Product Image - REMOVED sticky to fix mobile scroll bug */}
        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-4 md:p-8 flex justify-center items-center">
          <img 
            src={product.image_url || product.image} 
            alt={product.title} 
            className="w-full max-h-[400px] md:max-h-[500px] object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            {product.title}
          </h1>
          
          <p className="text-xl md:text-3xl font-bold text-pmorange mb-6">
            KSh {Number(product.price).toLocaleString()}
          </p>

          <div className="border-t border-b py-6 mb-6">
            <h3 className="text-lg font-bold mb-3">Specifications & Details</h3>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
              {product.description || "No specific details provided for this model."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:gap-4">
            <button 
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="w-full bg-gray-100 text-gray-900 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                addToCart({ ...product, quantity: 1 });
                navigate('/checkout');
              }}
              className="w-full bg-pmorange text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-orange-600 transition shadow-lg"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery Note */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-sm font-bold text-gray-900">Delivery Information</p>
                <p className="text-xs md:text-sm text-gray-600">
                  Free delivery within Nairobi CBD. Reliable upcountry shipping via G4S or Wells Fargo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
