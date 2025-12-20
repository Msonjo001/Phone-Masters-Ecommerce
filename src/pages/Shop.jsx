// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vnsubjweybalebejsope.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3ViandleWJhbGViZWpzb3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTI0NTQsImV4cCI6MjA3Nzc2ODQ1NH0.GoAXho3AaN-ztly8yCDAPFEIVWbWlgNsV01b7NnSHA0";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // default: newest first

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]); // refetch when sorting changes

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("price", { ascending: sortOrder === "asc" }); // sorting by price
      if (error) throw error;

      // ✅ Normalize image URLs
      const normalized = (data || []).map((p) => {
        let img = p.image || null;
        if (img && !img.startsWith("http")) {
          img = `${supabaseUrl}/storage/v1/object/public/product-images/${encodeURIComponent(img)}`;
        }
        return { ...p, image: img };
      });

      setProducts(normalized);
    } catch (err) {
      console.error("fetchProducts error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter products by search
  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

// REPLACE the return section of your Shop.jsx with this:
return (
  <div className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">🛒 Our Shop</h1>

    {/* 🔍 Search & Sort: Stacked on mobile, side-by-side on PC */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search for a phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-full py-2 px-10 focus:border-pmorange outline-none transition-all"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
      
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border-2 border-gray-200 rounded-full p-2 w-full md:w-48 bg-white outline-none"
      >
        <option value="desc">Price: High to Low</option>
        <option value="asc">Price: Low to High</option>
      </select>
    </div>

    {filteredProducts.length === 0 ? (
      <div className="text-center py-20 text-gray-500">No products found...</div>
    ) : (
      /* GRID: 2 columns on small screens, 4 on desktop */
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-4">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            title={p.title}
            price={`KSh ${Number(p.price).toLocaleString()}`}
            image={p.image}
            description={p.description}
          />
        ))}
      </div>
    )}
  </div>
);
}
