import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const { user, token, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${user.id}`, {
          headers: {
            Authorization: token
          }
        });
        // Sort orders by timestamp descending so newest is first
        const sortedOrders = (response.data || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.response?.data?.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-44 bg-gray-200 rounded-3xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Title */}
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-2">
          <span>My Orders</span>
          <span className="h-1.5 w-1.5 rounded-full bg-zomatoRed"></span>
        </h1>

        {error && (
          <div className="text-sm text-red-500 font-medium p-4 bg-red-50 border border-red-100 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-md mx-auto animate-fade-in">
            <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-6">It seems you haven't ordered anything yet. Let's change that!</p>
            <Link 
              to="/" 
              className="bg-zomatoRed text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition-all duration-200"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          /* Past orders list */
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.timestamp).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
                >
                  {/* Invoice Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-400 font-bold tracking-wide">ORDER ID</p>
                      <p className="text-sm font-semibold text-gray-800">{order.id}</p>
                    </div>

                    <div className="space-y-0.5 text-left md:text-right">
                      <p className="text-xs text-gray-400 font-bold tracking-wide">ORDERED ON</p>
                      <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div className="px-6 py-4 flex-grow space-y-3.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border border-green-600 p-0.5 rounded-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          </span>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                          <span className="text-xs text-gray-400 font-bold bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Cost */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Grand Total</span>
                    <span className="text-xl font-black text-gray-950">₹{order.total}</span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
