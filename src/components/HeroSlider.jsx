import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🧡 Local fallback ads (used only if Supabase is empty)
import ad1 from "../assets/ads/ad1.jpg";
import ad2 from "../assets/ads/ad2.jpg";
import ad3 from "../assets/ads/ad3.jpg";

const fallbackAds = [
  { image_url: ad1, link: null },
  { image_url: ad2, link: null },
  { image_url: ad3, link: null },
];

// 🔗 Supabase client
const supabaseUrl = "https://vnsubjweybalebejsope.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3ViandleWJhbGViZWpzb3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTI0NTQsImV4cCI6MjA3Nzc2ODQ1NH0.GoAXho3AaN-ztly8yCDAPFEIVWbWlgNsV01b7NnSHA0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HeroSlider() {
  const [ads, setAds] = useState(fallbackAds);
  const [current, setCurrent] = useState(0);

  // 🧡 Fetch ads from Supabase
  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from("homepage_ads")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data.length > 0) {
        setAds(data);
      } else {
        setAds(fallbackAds); // fallback if no ads
      }
    };

    fetchAds();
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [ads]);

  return (
    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden shadow-lg">
      {ads.map((ad, index) => {
        const content = (
          <img
            key={index}
            src={ad.image_url}
            alt={`Ad ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        );

        // If ad has a link, wrap in <a>
        return ad.link ? (
          <a
            key={index}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-pmorange" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
