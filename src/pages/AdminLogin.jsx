// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js"; // ✅ make sure this file exists

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // ✅ redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/admin-dashboard");
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-pmorange">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-pmorange text-white py-2 rounded hover:bg-orange-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
