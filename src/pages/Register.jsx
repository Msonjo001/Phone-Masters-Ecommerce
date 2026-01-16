import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Info Form, 2: OTP Verification
  const [method, setMethod] = useState("email"); // Selection for OTP destination
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Added for password toggle
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "" 
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Logic for Kenyan phone formatting
      const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone.startsWith("+") ? form.phone : `+254${form.phone}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { 
            full_name: form.name,
            phone_number: formattedPhone 
          }
        }
      });

      if (signUpError) throw signUpError;

      if (method === "phone") {
        const { error: otpError } = await supabase.auth.signInWithOtp({ 
            phone: formattedPhone 
        });
        if (otpError) throw otpError;
      }

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone.startsWith("+") ? form.phone : `+254${form.phone}`;
      
      let result;
      if (method === "phone") {
        result = await supabase.auth.verifyOtp({ 
            phone: formattedPhone, 
            token: form.otp, 
            type: 'sms' 
        });
      } else {
        result = await supabase.auth.verifyOtp({ 
            email: form.email, 
            token: form.otp, 
            type: 'signup' 
        });
      }

      if (result.error) throw result.error;
      
      alert("Registration Successful!");
      navigate("/");
    } catch (err) {
      setError("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-center text-pmorange mb-2">PhoneMasters</h2>
        <p className="text-gray-400 text-center mb-8 font-medium font-bold uppercase tracking-widest text-xs">Register your account</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs mb-6 border border-red-100 font-bold uppercase tracking-tight">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
            
            <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} />

            {/* ✅ Added Prefix UI for Phone */}
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 font-bold">+254</span>
              <input type="tel" placeholder="712345678" className="w-full p-4 pl-16 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>

            {/* ✅ Added Show/Hide Password Toggle */}
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Create Password" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-4 text-xs font-bold text-gray-400 uppercase tracking-tighter"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="p-4 bg-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Receive OTP via:</p>
              <div className="flex gap-4">
                <button type="button" onClick={() => setMethod("email")} className={`flex-1 py-2 rounded-xl font-bold text-xs ${method === 'email' ? 'bg-white text-pmorange shadow-sm' : 'text-gray-400'}`}>EMAIL</button>
                <button type="button" onClick={() => setMethod("phone")} className={`flex-1 py-2 rounded-xl font-bold text-xs ${method === 'phone' ? 'bg-white text-pmorange shadow-sm' : 'text-gray-400'}`}>PHONE (SMS)</button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-pmorange text-white py-4 rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-transform">
              {loading ? "SENDING CODE..." : "CREATE ACCOUNT"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Verify the code sent to your <b>{method}</b></p>
              <p className="font-bold text-gray-800">{method === 'email' ? form.email : form.phone}</p>
            </div>
            
            {/* ✅ Numeric-only OTP input with handle function */}
            <input 
              type="text" 
              inputMode="numeric"
              placeholder="0 0 0 0 0 0" 
              className="w-full p-5 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-widest focus:border-pmorange outline-none"
              value={form.otp}
              onChange={e => setForm({...form, otp: e.target.value.replace(/\D/g, '')})} 
              required 
              maxLength={6} 
            />
            
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black">CONFIRM OTP</button>
            <button type="button" onClick={() => { setStep(1); setForm({...form, otp: ""}); }} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest">Back to edit info</button>
          </form>
        )}
      </div>
    </div>
  );
}