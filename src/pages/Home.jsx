import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import { supabase } from '../supabaseClient.js';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchFeatured();
    fetchAds();
  }, []);

  // ✅ Get featured products
  const fetchFeatured = async () => {
    const { data, error } = await supabase
      .from("featured_products")
      .select(`
        id,
        product_id,
        products (
          id,
          title,
          price,
          image,
          description
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.log("Supabase error:", error);
      return;
    }

    // flatten product object and include description
    const cleanData = data.map((item) => item.products);
    setFeatured(cleanData);
  };

  // ✅ Get homepage ads
  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("homepage_ads")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setAds(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section - Improved stacking for mobile visibility */}
      <section className="rounded-xl overflow-hidden flex flex-col lg:flex-row items-center bg-gradient-to-r from-white to-gray-50 p-6 gap-8">
        <div className="w-full lg:flex-1 text-center lg:text-left">
          <h1 className="text-3xl md:text-5xl font-bold">PhoneMasters Kenya</h1>
          <p className="mt-3 text-gray-700 max-w-xl mx-auto lg:mx-0">
            Your one-stop shop for quality phones, accessories, and fast repairs.
          </p>

          <div className="mt-6 flex justify-center lg:justify-start gap-3">
            <Link to="/shop" className="px-8 py-3 rounded-lg bg-pmorange text-white font-bold hover:bg-orange-600 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>

        {/* This container now stays visible by taking full width on mobile */}
        <div className="w-full lg:flex-1">
          <HeroSlider ads={ads} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-12 mb-10">
        <h2 className="text-2xl font-bold border-b pb-2">Featured Products</h2>

        {featured.length === 0 ? (
          <p className="text-gray-500 mt-3">No featured products added yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-4">
            {featured.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={`KSh ${item.price.toLocaleString()}`}
                image={item.image}
                description={item.description} // ✅ Now passing description to card
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
