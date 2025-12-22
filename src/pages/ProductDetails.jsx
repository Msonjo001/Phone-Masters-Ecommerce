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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Product Image */}
        <div className="bg-gray-50 rounded-2xl p-8 flex justify-center sticky top-24">
          <img 
            src={product.image_url || product.image} 
            alt={product.title} 
            className="max-h-[500px] object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-2xl md:text-3xl font-bold text-pmorange mb-6">
            KSh {Number(product.price).toLocaleString()}
          </p>

          <div className="border-t border-b py-6 mb-6">
            <h3 className="text-lg font-bold mb-2">Specifications & Details</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description || "No specific details provided for this model."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                addToCart({ ...product, quantity: 1 });
                navigate('/checkout');
              }}
              className="flex-1 bg-pmorange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Delivery Info:</strong> Free delivery within Nairobi CBD. Upcountry delivery available via G4S or preferred courier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}