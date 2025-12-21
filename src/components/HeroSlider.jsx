import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient.js';

// 🧡 Local fallback ads
import ad1 from "../assets/ads/ad1.jpg";
import ad2 from "../assets/ads/ad2.jpg";
import ad3 from "../assets/ads/ad3.jpg";

const fallbackAds = [
  { image_url: ad1, link: null },
  { image_url: ad2, link: null },
  { image_url: ad3, link: null },
];

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

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  // 👋 Mobile Touch Functions
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
      /* Added min-h-[200px] to ensure it never collapses to 0 height on mobile */
      className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 min-h-[200px] rounded-xl overflow-hidden shadow-md group mt-2"
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
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
              <img
                src={ad.image_url}
                alt="PhoneMasters Promotion"
                /* Added object-center to keep the middle of the ad visible */
                className="w-full h-full object-cover object-center"
              />
            </a>
          ) : (
            <img
              src={ad.image_url}
              alt="PhoneMasters Promotion"
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
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
