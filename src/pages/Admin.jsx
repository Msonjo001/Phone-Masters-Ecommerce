// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Load existing products from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(saved);
  }, []);

  // Save products to localStorage
  const saveProducts = (data) => {
    localStorage.setItem("products", JSON.stringify(data));
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.image) {
      alert("Please fill in at least title, price and image.");
      return;
    }

    let updated;
    if (editingIndex !== null) {
      updated = products.map((p, i) => (i === editingIndex ? form : p));
      setEditingIndex(null);
    } else {
      updated = [...products, form];
    }

    saveProducts(updated);
    setForm({ title: "", price: "", description: "", image: "" });
  };

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this product?")) {
      const updated = products.filter((_, i) => i !== index);
      saveProducts(updated);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (KSh)"
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full border rounded p-2"
          rows="2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border rounded p-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-pmorange text-white py-2 rounded hover:bg-orange-500"
        >
          {editingIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Current Products</h2>
      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          products.map((p, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-pmorange">KSh {p.price}</p>
                {p.description && (
                  <p className="text-sm text-gray-600">{p.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
