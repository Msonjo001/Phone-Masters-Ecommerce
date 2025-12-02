import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

// Constant for the delivery fee
const DELIVERY_FEE = 350;

// Helper function to clean and parse the price string
const cleanPrice = (priceString) => {
    const numPrice = parseFloat(priceString.replace(/[^\d.]/g, ""));
    return isNaN(numPrice) ? 0 : numPrice;
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    // REMOVED: paymentConfirmed state is no longer needed
  });
  
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const itemsTotal = cart.reduce((sum, item) => {
    return sum + cleanPrice(item.price);
  }, 0);

  const finalTotal = itemsTotal + DELIVERY_FEE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Updated validation (removed paymentConfirmed check)
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all required delivery fields.");
      setIsLoading(false); 
      return;
    }

    try {
      // 1. SAVE PENDING ORDER AND GET ORDER ID
      const orderRecords = cart.map((item) => ({
        name: form.name,
        phone: form.phone,
        location: form.address,
        email: "", // FIX RETAINED: Workaround for mandatory 'email' column
        product_id: item.id,
        
        // STATUS: Set to 'Initiated' (or 'Pending Payment')
        status: "Initiated", 
        
        created_at: new Date().toISOString(),
        amount_paid: cleanPrice(item.price), 
      }));

      // Perform batch insert and capture the returned data
      const { data: insertedOrders, error: insertError } = await supabase
        .from("orders")
        .insert(orderRecords)
        .select('id'); // Requesting the primary key (id) back

      if (insertError) throw insertError;
      
      // Get the ID of the first inserted order (assuming they are grouped by a single checkout)
      const firstOrderId = insertedOrders[0].id;
      
      // 2. INITIATE STK PUSH
      const response = await fetch(
        // Ensure this URL is correct
        "https://vnsubjweybalebejsope.supabase.co/functions/v1/initiate-stk-push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            // Pass the required M-Pesa data and the Order ID
            phone: form.phone.startsWith("0") ? `254${form.phone.substring(1)}` : form.phone,
            amount: finalTotal, 
            orderId: firstOrderId, // Pass the ID back to the function
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Success: STK push initiated, now waiting for M-Pesa callback
        alert("✅ M-Pesa STK Push sent successfully! Check your phone for the PIN prompt.");
        
        // Show success, but DO NOT clear the cart yet. The callback will handle that.
        setSuccess(true);
        // We navigate back after a successful initiation
        setTimeout(() => navigate("/"), 5000); 

      } else {
        // If STK initiation fails, update the order status back to 'Failed' (optional but helpful)
        await supabase.from("orders").update({ status: 'Payment Failed' }).eq('id', firstOrderId);
        
        alert(`❌ Payment initiation failed: ${responseData.message || 'Unknown error'}`);
      }

    } catch (err) {
      console.error("Order submission error:", err);
      alert("❌ Failed to initiate order/payment.");
    } finally {
      setIsLoading(false); // Ensure loading is reset regardless of success/fail
    }
  };

  // ... (rest of the component remains the same, but the UI below is updated)

  if (success) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-pmorange mb-2">
          Payment Initiated!
        </h2>
        <p>A prompt has been sent to your phone. Please complete the payment to finalize the order.</p>
        <p className="mt-4">You will be redirected shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Order Summary (Uses finalTotal) */}
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium mb-2">Order Summary</h2>
            
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between border-b py-2 text-sm">
                <span>{item.title}</span>
                <span>{item.price}</span>
              </div>
            ))}
            
            <div className="flex justify-between py-2 text-sm">
              <span className="font-medium">Delivery Fee:</span>
              <span>KSh {DELIVERY_FEE.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-semibold pt-3 text-lg border-t-2 border-dashed mt-2">
              <span>Final Total:</span>
              <span className="text-pmorange">
                KSh {finalTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Instructions (Updated for STK Push) */}
          <div className="bg-gray-100 border-l-4 border-pmorange p-4 mb-6 rounded">
            <h3 className="font-semibold text-pmorange mb-2">
              M-Pesa Express Payment
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Click **Pay Now** to receive the prompt on your phone for **KSh {finalTotal.toLocaleString()}**.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Ensure your phone is near and unlocked.
            </p>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full border rounded p-2" required />
            <input type="text" name="address" placeholder="Delivery Address / Town" value={form.address} onChange={handleChange} className="w-full border rounded p-2" required />
            <textarea name="note" placeholder="Additional Notes (optional)" value={form.note} onChange={handleChange} className="w-full border rounded p-2" rows="3" ></textarea>

            {/* REMOVED: Manual payment confirmation checkbox */}

            <button
              type="submit"
              className="w-full bg-pmorange text-white py-3 rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
              disabled={isLoading || cart.length === 0} 
            >
              {isLoading ? "Initiating Payment..." : `Pay KSh ${finalTotal.toLocaleString()}`} 
            </button>
          </form>
        </>
      )}
    </div>
  );
}