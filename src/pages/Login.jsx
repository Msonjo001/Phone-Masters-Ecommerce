import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [method, setMethod] = useState("email"); // 'email' or 'phone'
  const [step, setStep] = useState(1); // 1: Login Form, 2: OTP Verification (for phone login)
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    otp: ""
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (method === "email") {
        // --- EMAIL/PASSWORD LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        // --- PHONE OTP LOGIN ---
        const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone.startsWith("+") ? form.phone : `+254${form.phone}`;
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });
        if (error) throw error;
        setStep(2); // Move to OTP entry
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone.startsWith("+") ? form.phone : `+254${form.phone}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: form.otp,
        type: 'sms'
      });
      if (error) throw error;
      navigate("/");
    } catch (err) {
      setError("Invalid OTP code.");
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

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Toggle between Email and Phone Login */}
            <div className="p-1 bg-gray-100 rounded-2xl flex gap-2 mb-4">
              <button type="button" onClick={() => setMethod("email")} className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${method === 'email' ? 'bg-white text-pmorange shadow-sm' : 'text-gray-400'}`}>EMAIL</button>
              <button type="button" onClick={() => setMethod("phone")} className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${method === 'phone' ? 'bg-white text-pmorange shadow-sm' : 'text-gray-400'}`}>PHONE (OTP)</button>
            </div>

            {method === "email" ? (
              <>
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
              </>
            ) : (
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400 font-bold">+254</span>
                <input type="tel" placeholder="712345678" className="w-full p-4 pl-16 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            )}

            <button disabled={loading} className="w-full bg-pmorange text-white py-4 rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-transform">
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4 cursor-pointer" onClick={() => navigate("/register")}>
              Don't have an account? <span className="text-pmorange font-bold">Register</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Enter the code sent to</p>
              <p className="font-bold text-gray-800">{form.phone}</p>
            </div>
            
            <input 
              type="text" inputMode="numeric" placeholder="0 0 0 0 0 0" 
              className="w-full p-5 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-widest focus:border-pmorange outline-none"
              value={form.otp} onChange={e => setForm({...form, otp: e.target.value.replace(/\D/g, '')})} 
              required maxLength={6} 
            />
            
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black">VERIFY LOGIN</button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest text-center">Back to login</button>
          </form>
        )}
      </div>
    </div>
  );
}