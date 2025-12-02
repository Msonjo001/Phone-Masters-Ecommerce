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

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">🛒 Shop</h1>

      {/* 🔍 Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-pmorange"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-lg p-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-pmorange"
        >
          <option value="desc">Highest → Lowest</option>
          <option value="asc">Lowest → Highest</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No matching products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
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
