import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error("Fetch restaurant detail error:", err);
        setError("Could not load restaurant details. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-80 bg-gray-200 rounded-3xl w-full"></div>
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Restaurant</h3>
        <p className="text-gray-500 text-sm mb-6">{error || "The requested restaurant could not be found."}</p>
        <Link to="/" className="bg-zomatoRed text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-zomatoRed transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Restaurants</span>
        </Link>
      </div>

      {/* Restaurant Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[16/6] md:aspect-[16/5] bg-gray-900 text-white">
          {/* Cover Photo */}
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-40 filter brightness-90"
          />
          {/* Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>

          {/* Details Overlay */}
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <span className="bg-white/20 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                {restaurant.cuisine}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-200 max-w-md font-medium drop-shadow-sm">
                Open now • Zomato Safe Delivery Guaranteed • ₹200 for one
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white font-black px-4 py-2 rounded-2xl flex flex-col items-center justify-center border border-emerald-500 shadow-md">
                <span className="text-lg md:text-xl flex items-center gap-1">
                  {restaurant.rating}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-100 tracking-wider">Rating</span>
              </div>

              <div className="bg-white/20 backdrop-blur-md text-white font-black px-4 py-2 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-md">
                <span className="text-base md:text-lg whitespace-nowrap">{restaurant.deliveryTime}</span>
                <span className="text-[9px] uppercase font-bold text-gray-200 tracking-wider">Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span>Order Online</span>
          <span className="h-1.5 w-1.5 rounded-full bg-zomatoRed"></span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {restaurant.menu && restaurant.menu.map((foodItem) => (
            <FoodCard 
              key={foodItem.id} 
              item={foodItem} 
              restaurantId={restaurant.id} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
