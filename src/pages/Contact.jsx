import React from "react";

export default function Contact() {
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-center">Contact Us</h2>

      {/* GRID CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Address */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-gray-700">
            Kimathi Street — Old Mutual Building,
            <br />1st Floor, Shop 105
          </p>
        </div>

        {/* Phone */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <a href="tel:0795386187" className="text-blue-600 underline text-lg">
            0795 386 187
          </a>
        </div>

        {/* WhatsApp */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
          <a
            href="https://wa.me/254795386187"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline text-lg"
          >
            Chat with us on WhatsApp
          </a>
        </div>

        {/* Hours */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
          <p className="text-gray-700 text-lg">
            Monday – Saturday:
            <br /> 8:00 AM – 7:00 PM
          </p>
        </div>
      </div>

      {/* GOOGLE MAP */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Find Us on Google Maps</h3>

        <div className="w-full h-80 rounded-xl overflow-hidden shadow-md border">
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Old+Mutual+Building+Kimathi+Street+Nairobi&output=embed"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
