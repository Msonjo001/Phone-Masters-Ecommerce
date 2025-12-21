import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🧡 Local fallback ads
import ad1 from "../assets/ads/ad1.jpg";
import ad2 from "../assets/ads/ad2.jpg";
import ad3 from "../assets/ads/ad3.jpg";

const fallbackAds = [
  { image_url: ad1, link: null },
  { image_url: ad2, link: null },
  { image_url: ad3, link: null },
];

// 🔗 Supabase client (Using your provided keys)
const supabaseUrl = "https://vnsubjweybalebejsope.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3ViandleWJhbGViZWpzb3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTI0NTQsImV4cCI6MjA3Nzc2ODQ1NH0.GoAXho3AaN-ztly8yCDAPFEIVWbWlgNsV01b7NnSHA0";


export default function HeroSlider() {
  const [ads, setAds] = useState(fallbackAds);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // 🧡 Fetch ads from Supabase
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data, error } = await supabase
          .from("homepage_ads")
          .select("*")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          setAds(data);
        }
      } catch (err) {
        console.error("Ads fetch error:", err);
      }
    };
    fetchAds();
  }, []);

  // Auto-slide every 5 seconds (slightly slower is better for reading on mobile)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  // 👋 Mobile Touch Functions (Swipe to change ads)
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const touchEnd = e.targetTouches[0].clientX;
    if (touchStart - touchEnd > 70) { // Swipe Left
      setCurrent((prev) => (prev + 1) % ads.length);
      setTouchStart(null);
    }
    if (touchStart - touchEnd < -70) { // Swipe Right
      setCurrent((prev) => (prev - 1 + ads.length) % ads.length);
      setTouchStart(null);
    }
  };

  return (
    <div 
      className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-md group mt-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {ad.link ? (
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img
                src={ad.image_url}
                alt="PhoneMasters Promotion"
                className="w-full h-full object-cover"
              />
            </a>
          ) : (
            <img
              src={ad.image_url}
              alt="PhoneMasters Promotion"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Navigation Arrows (Visible on hover for PC) */}
      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + ads.length) % ads.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hidden group-hover:block"
      >
        ❮
      </button>
      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % ads.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hidden group-hover:block"
      >
        ❯
      </button>

      {/* Modern Pill-shaped Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 h-1.5 rounded-full ${
              index === current ? "w-6 bg-pmorange" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
