import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-1 focus:outline-none">
                <span className="text-3xl font-black tracking-tight text-zomatoRed italic font-serif">zomato</span>
                <span className="h-2.5 w-2.5 rounded-full bg-zomatoRed animate-pulse mt-3"></span>
              </Link>
            </div>

            {/* Navigation Right */}
            <div className="flex items-center gap-4 md:gap-6">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/orders" 
                    className="text-gray-600 hover:text-zomatoRed font-medium text-sm transition-colors duration-200"
                  >
                    My Orders
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-zomatoRed flex items-center justify-center font-bold text-sm border border-red-200 shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-gray-700 text-sm font-semibold max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-zomatoRed text-sm font-medium border border-gray-200 hover:border-red-200 rounded-full px-3 py-1.5 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-zomatoRed text-sm font-medium transition-colors duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-zomatoRed text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2.5 text-gray-600 hover:text-zomatoRed bg-gray-50 hover:bg-red-50 rounded-full transition-all duration-300 focus:outline-none active:scale-90"
                aria-label="Open cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-zomatoRed text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
