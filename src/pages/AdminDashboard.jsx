// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient.js';



export default function AdminDashboard() {
  const navigate = useNavigate();

  // product form
  const [product, setProduct] = useState({ title: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);

  // data lists
  const [products, setProducts] = useState([]);
  const [featuredIds, setFeaturedIds] = useState(new Set()); // set of product ids that are featured
  const [ads, setAds] = useState([]);
  const [orders, setOrders] = useState([]);

  // UI state
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);
  const [addingFeature, setAddingFeature] = useState(false);
  const [addingAd, setAddingAd] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn");
    if (isAdmin !== "true") navigate("/admin-login");

    fetchAllData();

    // realtime orders listening
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          // on any change, refresh orders (keeps it simple & robust)
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAllData = async () => {
    await Promise.all([fetchProducts(), fetchFeatured(), fetchAds(), fetchOrders()]);
  };

  // -------------------------
  // PRODUCTS (main table)
  // -------------------------
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setLoadingProducts(false);
  };

  // Add product (uploads image to storage and stores public URL in products table)
  const uploadImageAndGetUrl = async (file) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    // data.publicUrl or data? supabase-js returns { data: { publicUrl } }
    const publicUrl = data?.publicUrl ?? data?.public_url ?? null;
    return { publicUrl, fileName };
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!product.title || !product.price || !imageFile) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const img = await uploadImageAndGetUrl(imageFile);
    if (!img?.publicUrl) {
      alert("Image upload failed.");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        title: product.title,
        price: parseFloat(product.price),
        description: product.description,
        image: img.publicUrl,
      },
    ]);

    if (error) {
      console.error("Failed to add product:", error);
      alert("❌ Failed to add product.");
    } else {
      setProduct({ title: "", price: "", description: "" });
      setImageFile(null);
      await fetchProducts();
      alert("✅ Product added.");
    }
  };

  const handleDeleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete product:", error);
    return;
    }
fetchProducts();
    // delete from storage (if filename exists)
    if (imageFilename) {
      await supabase.storage.from("product-images").remove([imageFilename]).catch((err) => {
        console.warn("Failed to remove image from storage (non-fatal):", err);
      });
    }

    // also remove any featured record
    await supabase.from("featured_products").delete().eq("product_id", id).catch(() => {});
    fetchProducts();
    fetchFeatured();
    alert("🗑 Product deleted.");
  };

  // -------------------------
  // FEATURED PRODUCTS (Option B: Add/Remove button)
  // table: featured_products { id, product_id, created_at }
  // -------------------------
  const fetchFeatured = async () => {
    const { data, error } = await supabase.from("featured_products").select("product_id");
    if (error) {
      console.error("Error fetching featured:", error);
      setFeaturedIds(new Set());
      return;
    }
    const ids = new Set((data || []).map((r) => r.product_id));
    setFeaturedIds(ids);
  };

  const addToFeatured = async (productId) => {
    setAddingFeature(true);
    const { error } = await supabase.from("featured_products").insert([{ product_id: productId }]);
    setAddingFeature(false);
    if (error) {
      console.error("Failed to add featured:", error);
      alert("❌ Could not add to featured.");
    } else {
      await fetchFeatured();
    }
  };

  const removeFromFeatured = async (productId) => {
    setAddingFeature(true);
    const { error } = await supabase.from("featured_products").delete().eq("product_id", productId);
    setAddingFeature(false);
    if (error) {
      console.error("Failed to remove featured:", error);
      alert("❌ Could not remove from featured.");
    } else {
      await fetchFeatured();
    }
  };

  // -------------------------
  // HOMEPAGE ADS
  // table: homepage_ads { id, image, filename, created_at }
  // -------------------------
  const fetchAds = async () => {
    setLoadingAds(true);
    const { data, error } = await supabase.from("homepage_ads").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error fetching ads:", error);
      setAds([]);
    } else {
      setAds(data || []);
    }
    setLoadingAds(false);
  };

  const addAd = async (file) => {
    if (!file) {
      alert("Please pick an image to upload.");
      return;
    }
    setAddingAd(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("homepage-ads").upload(fileName, file);
    if (uploadError) {
      console.error("Ad upload failed:", uploadError);
      setAddingAd(false);
      alert("❌ Ad upload failed.");
      return;
    }

    const { data } = supabase.storage.from("homepage-ads").getPublicUrl(fileName);
    const publicUrl = data?.publicUrl ?? data?.public_url ?? null;
    if (!publicUrl) {
      setAddingAd(false);
      alert("❌ Could not get ad public url.");
      return;
    }

    const { error } = await supabase.from("homepage_ads").insert([
      { image: publicUrl, filename: fileName },
    ]);

    setAddingAd(false);
    if (error) {
      console.error("Failed to add ad row:", error);
      alert("❌ Could not save ad.");
      return;
    }

    await fetchAds();
    alert("✅ Ad added.");
  };

  const deleteAd = async (rowId, filename) => {
    if (!confirm("Delete ad?")) return;
    // delete DB row
    const { error } = await supabase.from("homepage_ads").delete().eq("id", rowId);
    if (error) {
      console.error("Failed to delete ad row:", error);
      alert("❌ Could not delete ad.");
      return;
    }
    // delete storage object
    if (filename) {
      await supabase.storage.from("homepage-ads").remove([filename]).catch((err) => {
        console.warn("Failed to remove ad from storage:", err);
      });
    }
    await fetchAds();
    alert("🗑 Ad removed.");
  };

  // -------------------------
  // ORDERS (live)
  // -------------------------
  const fetchOrders = async () => {
    // fetch orders and embed product title + price via relationship (products table)
    // note: this relies on a foreign key relationship defined in Supabase between orders.product_id -> products.id
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        name,
        phone,
        location,
        status,
        created_at,
        amount_paid,
        products ( id, title, price )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }
  };

  // -------------------------
  // Helpers / UI
  // -------------------------
  const handleProductInputChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-3">
          <h1 className="text-2xl font-bold text-pmorange">🛠 Admin Dashboard</h1>
          <button onClick={() => { localStorage.removeItem("isAdminLoggedIn"); navigate("/admin-login"); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
        </div>

        {/* Add Product */}
        <form onSubmit={handleAddProduct} className="border rounded-lg p-6 shadow space-y-4 mb-10">
          <h2 className="text-lg font-semibold mb-3">Add New Product</h2>
          <input type="text" name="title" placeholder="Product Name" value={product.title} onChange={handleProductInputChange} className="w-full border rounded p-2" required />
          <input type="number" name="price" placeholder="Product Price (KSh)" value={product.price} onChange={handleProductInputChange} className="w-full border rounded p-2" required />
          <textarea name="description" placeholder="Product Description" value={product.description} onChange={handleProductInputChange} className="w-full border rounded p-2" rows="3" />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border rounded p-2" required />
          {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
          <button type="submit" className="w-full bg-pmorange text-white py-2 rounded hover:bg-orange-500">Add Product</button>
        </form>

        {/* Products + Featured controls */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">🛍 Products</h2>
            <div className="text-sm text-gray-600">{loadingProducts ? "Loading..." : `${products.length} items`}</div>
          </div>

          {products.length === 0 ? (
            <p>No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => {
                const isFeatured = featuredIds.has(p.id);
                return (
                  <div key={p.id} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                    <img src={p.image || "https://via.placeholder.com/300?text=No+Image"} alt={p.title} className="w-full h-32 object-cover rounded" />
                    <h3 className="font-semibold mt-2">{p.title}</h3>
                    <p className="text-pmorange font-medium">KSh {Number(p.price).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description || "No description"}</p>

                    <div className="mt-3 flex gap-2">
                      {isFeatured ? (
                        <button onClick={() => removeFromFeatured(p.id)} disabled={addingFeature} className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded">Remove from Featured</button>
                      ) : (
                        <button onClick={() => addToFeatured(p.id)} disabled={addingFeature} className="flex-1 px-3 py-2 bg-pmorange text-white rounded">Add to Featured</button>
                      )}

                      <button onClick={() => handleDeleteProduct(p.id, p.image_filename)} className="px-3 py-2 text-red-500 border rounded">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ads management */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">🏷 Homepage Ads</h2>

          <AdManager addAd={addAd} ads={ads} loading={loadingAds} deleteAd={deleteAd} />
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">📦 Recent Orders</h2>
          {orders.length === 0 ? (
            <p>No recent orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border-b text-left">Customer</th>
                    <th className="py-2 px-3 border-b text-left">Phone</th>
                    <th className="py-2 px-3 border-b text-left">Location</th>
                    <th className="py-2 px-3 border-b text-left">Product</th>
                    <th className="py-2 px-3 border-b text-left">Amount Paid (KSh)</th>
                    <th className="py-2 px-3 border-b text-left">Status</th>
                    <th className="py-2 px-3 border-b text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b">{order.name}</td>
                      <td className="py-2 px-3 border-b">{order.phone}</td>
                      <td className="py-2 px-3 border-b">{order.location}</td>
                      <td className="py-2 px-3 border-b">{order.products?.title || "—"}</td>
                      <td className="py-2 px-3 border-b">KSh {order.amount_paid?.toLocaleString() ?? (order.products?.price ? Number(order.products.price).toLocaleString() : "—")}</td>
                      <td className="py-2 px-3 border-b">
                        <select
                          value={order.status || "Pending"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
                            if (error) {
                              alert("Failed to update status");
                              console.error(error);
                            } else {
                              fetchOrders();
                            }
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border-b text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ---------- Small sub-component for Ad management ----------
function AdManager({ addAd, ads, loading, deleteAd }) {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pick an image first.");
      return;
    }
    await addAd(file);
    setFile(null);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <form onSubmit={handleUpload} className="flex gap-2 items-center mb-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="border rounded p-2" />
        <button type="submit" className="bg-pmorange text-white px-4 py-2 rounded">Upload Ad</button>
      </form>

      {loading ? (
        <p>Loading ads...</p>
      ) : ads.length === 0 ? (
        <p>No ads yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ads.map((a) => (
            <div key={a.id} className="border rounded p-2 flex flex-col items-start">
              <img src={a.image || "https://via.placeholder.com/300?text=No+Image"} alt={`ad-${a.id}`} className="w-full h-36 object-cover rounded" />
              <div className="w-full flex items-center justify-between mt-2">
                <small className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</small>
                <button onClick={() => deleteAd(a.id, a.filename)} className="text-sm text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
