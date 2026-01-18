import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-center text-pmorange mb-2">PhoneMasters</h2>
        <p className="text-gray-400 text-center mb-8 font-medium font-bold uppercase tracking-widest text-xs">Welcome Back</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs mb-6 border border-red-100 font-bold uppercase tracking-tight">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-xs font-bold text-gray-400 uppercase">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button disabled={loading} className="w-full bg-pmorange text-white py-4 rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-transform">
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4 cursor-pointer" onClick={() => navigate("/register")}>
            New here? <span className="text-pmorange font-bold">Create Account</span>
          </p>
        </form>
      </div>
    </div>
  );
}