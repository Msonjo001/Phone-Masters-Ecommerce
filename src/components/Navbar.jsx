import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import logo from '../assets/logo.png';


export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // For user dropdown

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold hidden sm:block">
            PhoneMasters <span className="text-pmorange">Ke</span>
          </span>
        </Link>

        {/* PC NAV LINKS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-pmorange">Home</Link>
          <Link to="/shop" className="hover:text-pmorange">Shop</Link>
          <Link to="/about" className="hover:text-pmorange">About</Link>
          <Link to="/contact" className="hover:text-pmorange">Contact</Link>
        </div>

        {/* RIGHT SIDE: CART + AUTH */}
        <div className="flex items-center gap-4">
          {/* Cart Icon (Always visible) */}
          <Link to="/cart" className="relative p-2 text-xl hover:bg-gray-100 rounded-full">
            🛒
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PC Auth Buttons */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button onClick={() => setOpenMenu(!openMenu)} className="px-4 py-1.5 border rounded-lg bg-gray-50 flex items-center gap-2">
                  {user.name || "Account"} ▾
                </button>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border rounded-xl py-2 z-[60]">
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" onClick={() => setOpenMenu(false)} className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                    )}
                    <button onClick={() => { logout(); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-pmorange text-white px-5 py-2 rounded-lg font-bold">Login</Link>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg">
          <Link to="/" onClick={toggleMobileMenu} className="font-semibold text-gray-700">Home</Link>
          <Link to="/shop" onClick={toggleMobileMenu} className="font-semibold text-gray-700">Shop</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="font-semibold text-gray-700">About</Link>
          <Link to="/contact" onClick={toggleMobileMenu} className="font-semibold text-gray-700">Contact</Link>
          <div className="pt-2 border-t">
            {user ? (
              <button onClick={() => { logout(); toggleMobileMenu(); }} className="w-full text-left text-red-600 font-bold italic">Logout ({user.name})</button>
            ) : (
              <Link to="/login" onClick={toggleMobileMenu} className="block w-full text-center bg-pmorange text-white py-2 rounded-lg">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}