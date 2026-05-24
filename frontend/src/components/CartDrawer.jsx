import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login first to place your order.");
      onClose();
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      // Map cart items for backend orders
      const itemsToSave = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: itemsToSave,
          total: cartTotal
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          clearCart();
          setIsSuccess(false);
          onClose();
          navigate('/orders');
        }, 2200); // Show success indicator for 2.2 seconds
      }
    } catch (error) {
      console.error("Order error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {isSuccess ? (
              /* Success Animation */
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Order Placed!</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Your food order has been successfully placed. Preparing to redirect to your orders page...
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart Screen */
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Your cart is empty</h3>
                  <p className="text-sm text-gray-400 px-4">Add delicious items from your favorite restaurants to fill it up!</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 text-zomatoRed border border-zomatoRed hover:bg-red-50 px-6 py-2 rounded-full font-bold text-sm transition-all duration-200"
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 py-3 border-b border-gray-50">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400">₹{item.price} each</p>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white text-gray-800 text-xs font-bold shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-red-50 hover:text-zomatoRed text-sm transition-all duration-150"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-red-50 hover:text-zomatoRed text-sm transition-all duration-150"
                      >
                        +
                      </button>
                    </div>
                    {/* Price and Remove */}
                    <div className="text-right flex flex-col items-end gap-1 min-w-[70px]">
                      <span className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-zomatoRed transition-colors duration-150 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer (Calculations & Place Order) */}
          {!isSuccess && cartItems.length > 0 && (
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between text-base font-bold text-gray-900 mb-4">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-normal">
                Taxes and restaurant delivery charges will be calculated during the final checkout stage.
              </p>

              {errorMessage && (
                <div className="text-xs text-red-500 font-medium mb-3 p-2 bg-red-50 border border-red-100 rounded">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-zomatoRed text-white font-extrabold py-3.5 rounded-xl shadow-md hover:bg-red-600 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span>{isAuthenticated ? "Place Order" : "Login to Place Order"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
