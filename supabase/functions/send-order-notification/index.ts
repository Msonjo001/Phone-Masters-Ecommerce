// /supabase/functions/send-order-notification/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // ✅ Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const data = await req.json();
    console.log("Incoming order:", data);

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const message = `
📦 *New Order Received!*
👤 Name: ${data.name}
📞 Phone: ${data.phone}
📍 Address: ${data.address}
🛍️ Items: ${data.items}
💰 Total: KSh ${data.total}
📝 Note: ${data.note || "None"}
`;
console.log("📨 Sending to Telegram with chat_id:", TELEGRAM_CHAT_ID);
console.log("📨 Telegram message:", message);
console.log(`✅ Telegram message sent for order: ${name}`);

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await telegramResponse.json();
    console.log("Telegram API response:", result);

    return new Response(
      JSON.stringify({ success: true, telegramResponse: result }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // ✅ allow frontend access
        },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // ✅ keep CORS open for errors too
      },
    });
  }
});
