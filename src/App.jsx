import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import Navbar from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ProductDetails from "./pages/ProductDetails.jsx";

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/admin-login") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🛠️ The New Responsive Navbar */}
      {!hideLayout && <Navbar />}

      {/* ROUTES */}
      <main className={`flex-1 ${!hideLayout ? 'container mx-auto px-4 py-6 md:py-10' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* PROTECTED ROUTES */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<UserProtectedRoute><Checkout /></UserProtectedRoute>} />
          <Route path="/cart" element={<UserProtectedRoute><Cart /></UserProtectedRoute>} />

          <Route path="*" element={<div className="py-20 text-center"><h2 className="text-2xl font-bold">404: Page not found</h2></div>} />
        </Routes>
      </main>

      {!hideLayout && (
        <footer className="bg-white border-t py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PhoneMasters Kenya — Quality Phones & Fast Repair
        </footer>
      )}
    </div>
  );
}