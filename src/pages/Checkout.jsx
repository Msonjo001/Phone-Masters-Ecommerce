import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

// ✅ 🇰🇪 All 47 Kenya Counties
const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", 
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", 
  "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", 
  "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", 
  "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", 
  "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", 
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

// Helper function to clean and parse the price string
const cleanPrice = (priceString) => {
    if (typeof priceString === 'number') return priceString;
    const numPrice = parseFloat(priceString.replace(/[^\d.]/g, ""));
    return isNaN(numPrice) ? 0 : numPrice;
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "Nairobi", // Default to Nairobi
    specificLocation: "", // Added for detailed address
    note: "",
  });
  
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  // ✅ Logic: Nairobi is Free (0), others are 350
  const deliveryFee = form.address === "Nairobi" ? 0 : 350;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const itemsTotal = cart.reduce((sum, item) => {
    return sum + cleanPrice(item.price);
  }, 0);

  const finalTotal = itemsTotal + deliveryFee;

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Prepare only the columns we know exist and are required
    const orderRecords = cart.map((item) => ({
      name: form.name,
      phone: form.phone,
      location: `${form.address} - ${form.specificLocation}`,
      product_id: item.id,
      status: "Initiated",
      amount_paid: cleanPrice(item.price)
    }));

    // ✅ CLEAN INSERT: We removed .select() and any reference to returned data.
    // This bypasses the SELECT policy check entirely.
    const { error: insertError } = await supabase
      .from("orders")
      .insert(orderRecords);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      throw insertError;
    }

    // 2. INITIATE STK PUSH (Independent of the DB ID)
    const tempReference = `ORD-${Date.now()}`;

    const response = await fetch(
      "https://vnsubjweybalebejsope.supabase.co/functions/v1/initiate-stk-push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: form.phone.startsWith("0") ? `254${form.phone.substring(1)}` : form.phone,
          amount: finalTotal,
          orderId: tempReference, 
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok && responseData.success) {
      alert("✅ Order Placed! Check your phone for M-Pesa prompt.");
      setSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate("/");
      }, 5000);
    } else {
      alert(`❌ Payment error: ${responseData.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Order submission error:", err);
    alert(`❌ Database Policy Error: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};

  if (success) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-pmorange mb-2">Payment Initiated!</h2>
        <p>A prompt has been sent to your phone. Please complete payment to finalize the order.</p>
        <p className="mt-4">You will be redirected shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Secure Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: FORM */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pmorange" required />
                <input type="tel" name="phone" placeholder="M-Pesa Number (e.g. 07...)" value={form.phone} onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pmorange" required />
              </div>
              
              {/* ✅ COUNTY DROPDOWN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-1">Select County</label>
                <select 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pmorange bg-white"
                >
                  {KENYA_COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              <input 
                type="text" 
                name="specificLocation" 
                placeholder="Specific Town / Estate / Landmark" 
                value={form.specificLocation} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pmorange" 
                required 
              />

              <textarea name="note" placeholder="Note to rider (Optional)" value={form.note} onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pmorange" rows="2"></textarea>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pmorange text-white py-4 rounded-xl text-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md mt-4"
              >
                {isLoading ? "⏳ Processing..." : `Complete Order KSh ${finalTotal.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <div className="bg-gray-50 p-6 rounded-2xl border sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} (x1)</span>
                    <span className="font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {itemsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery ({form.address})</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-bold" : "text-gray-900 font-medium"}>
                    {deliveryFee === 0 ? "FREE" : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-pmorange text-2xl">KSh {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}