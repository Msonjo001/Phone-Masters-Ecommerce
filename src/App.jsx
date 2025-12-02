import React, { useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import logo from './assets/logo.png'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import { useAuth } from './context/AuthContext.jsx'
import MainLayout from "./layouts/MainLayout.jsx";
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import { useCart } from "./context/CartContext.jsx";   // ✅ ADDED

export default function App() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();   // ✅ GET CART COUNT
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/admin-login") ||
    location.pathname.startsWith("/admin-dashboard");

  // User dropdown toggle
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && (
        <nav className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">

            {/* LOGO + BRAND */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="PhoneMasters Kenya" className="w-10 h-10 object-contain" />
              <Link to="/" className="text-xl font-semibold">
                PhoneMasters <span className="text-pmorange">Ke</span>
              </Link>
            </div>

            {/* NAV LINKS */}
            <div className="flex items-center gap-6">

              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/shop" className="hover:underline">Shop</Link>
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>

              {/* CART WITH BADGE */}
              <Link to="/cart" className="relative hover:underline text-lg">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* USER DROPDOWN */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu((prev) => !prev)}
                    className="px-3 py-1 border rounded bg-gray-100"
                  >
                    {user.name || "Account"} ▼
                  </button>

                  {/* Dropdown menu */}
                  {openMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>

                      {user.role === "admin" && (
                        <Link
                          to="/admin-dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-1 rounded bg-pmorange text-white">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-1 rounded bg-gray-200 border">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* ROUTES */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>

          <Route element={<MainLayout />} />

          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER-ONLY ROUTES */}
          <Route
            path="/checkout"
            element={
              <UserProtectedRoute>
                <Checkout />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <UserProtectedRoute>
                <Cart />
              </UserProtectedRoute>
            }
          />

          {/* PUBLIC ROUTES */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN FALLBACK */}
          <Route
            path="/admin"
            element={user && user.role === 'admin' ? <Admin /> : <Navigate to="/login" replace />}
          />

          <Route path="*" element={<div className="py-12 text-center"><h2 className="text-2xl">Page not found</h2></div>} />
        </Routes>
      </main>

      {!hideLayout && (
        <footer className="border-t py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} PhoneMasters Kenya — All rights reserved.
        </footer>
      )}
    </div>
  );
}
