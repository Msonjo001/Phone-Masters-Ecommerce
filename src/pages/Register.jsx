import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { 
            full_name: form.name,
            phone_number: form.phone // Saved for checkout autofill
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // Auto-navigate to home after successful registration
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-center text-pmorange mb-2">PhoneMasters</h2>
        <p className="text-gray-400 text-center mb-8 font-bold uppercase tracking-widest text-xs">Create Account</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs mb-6 font-bold uppercase">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-400 font-bold">+254</span>
            <input type="tel" placeholder="712345678" className="w-full p-4 pl-16 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>

          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-xs font-bold text-gray-400 uppercase">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button disabled={loading} className="w-full bg-pmorange text-white py-4 rounded-2xl font-black shadow-xl">
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
}