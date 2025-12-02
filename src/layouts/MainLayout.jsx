import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔸 Keep the hero section persistent */}
      <section className="rounded-lg overflow-hidden flex flex-col md:flex-row items-center bg-gradient-to-r from-white to-gray-50 p-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">PhoneMasters Kenya</h1>
          <p className="mt-3 text-gray-700 max-w-xl">
            Your one-stop shop for quality phones, accessories, and fast repairs.
          </p>

          <div className="mt-6 flex gap-3">
            <Link to="/shop" className="px-5 py-3 rounded bg-pmorange text-white">
              Shop Now
            </Link>       
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0 md:pl-8">
          <div className="w-full h-56 bg-gray-100 rounded flex items-center justify-center">
            Image / Slider
          </div>
        </div>
      </section>

      {/* 🔹 Route content (changes below hero) */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
