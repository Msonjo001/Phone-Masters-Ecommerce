import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import { supabase } from '../supabaseClient.js';

// ✅ Supabase config
const supabaseUrl = "https://vnsubjweybalebejsope.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3ViandleWJhbGViZWpzb3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTI0NTQsImV4cCI6MjA3Nzc2ODQ1NH0.GoAXho3AaN-ztly8yCDAPFEIVWbWlgNsV01b7NnSHA0";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        image
      )
    `)
    .order("id", { ascending: false });

  if (error) {
    console.log("Supabase error:", error);
    return;
  }

  // flatten product object
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
    <div>
      {/* Hero Section */}
      <section className="rounded-lg overflow-hidden flex flex-col md:flex-row items-center bg-gradient-to-r from-white to-gray-50 p-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">PhoneMasters Kenya</h1>
          <p className="mt-3 text-gray-700 max-w-xl">
            Your one-stop shop for quality phones, accessories, and fast repairs.
          </p>

          <div className="mt-6 flex gap-3">
            <Link to="/shop" className="px-5 py-3 rounded bg-pmorange text-white">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0 md:pl-8">
          {/* ✅ Pass ads to HeroSlider */}
          <HeroSlider ads={ads} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Featured Products</h2>

        {featured.length === 0 ? (
          <p className="text-gray-500 mt-3">No featured products added yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-4">
            {featured.map((item) => (
              <ProductCard
                key={item.id}
                title={item.title}
                price={`KSh ${item.price.toLocaleString()}`}
                image={item.image}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
