import React, { useState } from "react";
import { supabase } from "../supabaseClient.js"; // Ensure this matches your setup
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP Verification
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request the OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Format phone to E.164 (e.g., +254700000000)
    const formattedPhone = phone.startsWith("0") 
      ? `+254${phone.substring(1)}` 
      : phone.startsWith("+") ? phone : `+${phone}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          // This saves the name into the user's metadata in Supabase Auth
          data: { full_name: name } 
        }
      });

      if (error) throw error;
      
      setStep(2); // Move to OTP input
    } catch (err) {
      setError(err.message || "Failed to send OTP. Check your phone number.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formattedPhone = phone.startsWith("0") 
      ? `+254${phone.substring(1)}` 
      : phone;

    try {
      const { error, data } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        alert("Account verified successfully!");
        navigate("/"); // Go to home page
      }
    } catch (err) {
      setError("Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center text-pmorange">
          PhoneMasters Kenya
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {step === 1 ? "Create your account" : "Verify your phone number"}
        </p>

        {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</p>}

        {step === 1 ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="George Konde"
                className="border rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-pmorange outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Phone Number</label>
              <input
                type="tel"
                placeholder="0742..."
                className="border rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-pmorange outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pmorange text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
            >
              {loading ? "Sending SMS..." : "Register & Get OTP"}
            </button>
          </form>
        ) : (
          /* OTP VERIFICATION FORM */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-center text-gray-600">
              Enter the 6-digit code sent to <b>{phone}</b>
            </p>
            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              className="border rounded-lg w-full p-4 text-center text-2xl tracking-[1rem] font-bold focus:ring-2 focus:ring-green-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              {loading ? "Verifying..." : "Confirm & Sign In"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-gray-500 text-sm"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-6 text-pmorange cursor-pointer hover:underline"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}