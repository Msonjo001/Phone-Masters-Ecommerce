import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Info Form, 2: OTP Verification
  const [method, setMethod] = useState("email"); // Selection for OTP destination
  const [loading, setLoading] = useState(false);
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
      // 1. Create User Identity in Supabase with Email/Password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { 
            full_name: form.name,
            phone_number: form.phone 
          }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Trigger OTP based on user preference
      if (method === "phone") {
        const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone;
        const { error: otpError } = await supabase.auth.signInWithOtp({ 
            phone: formattedPhone 
        });
        if (otpError) throw otpError;
      } else {
          // If email is selected, Supabase sends the code automatically 
          // based on your Dashboard "Confirm Email" settings.
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
      let result;
      if (method === "phone") {
        const formattedPhone = form.phone.startsWith("0") ? `+254${form.phone.substring(1)}` : form.phone;
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
              onChange={e => setForm({...form, name: e.target.value})} />
            
            <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              onChange={e => setForm({...form, email: e.target.value})} />

            <input type="tel" placeholder="Phone (07...)" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              onChange={e => setForm({...form, phone: e.target.value})} />

            <input type="password" placeholder="Create Password" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pmorange" required
              onChange={e => setForm({...form, password: e.target.value})} />

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
            <input type="text" placeholder="● ● ● ● ● ●" className="w-full p-5 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-widest focus:border-pmorange outline-none"
              onChange={e => setForm({...form, otp: e.target.value})} required maxLength={6} />
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black">CONFIRM OTP</button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest">Back to edit info</button>
          </form>
        )}
      </div>
    </div>
  );
}