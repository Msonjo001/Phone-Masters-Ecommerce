export async function sendOrderNotification(orderData) {
  try {
    const response = await fetch(
      "https://vnsubjweybalebejsope.supabase.co/functions/v1/send-order-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ Your Supabase anon key (same as in supabaseClient.js)
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const result = await response.json();
    console.log("✅ Telegram notification sent:", result);
    return result;
  } catch (error) {
    console.error("❌ sendOrderNotification error:", error);
    throw error;
  }
}
