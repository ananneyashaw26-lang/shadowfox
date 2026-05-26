import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = [
    { name: 'All', emoji: '🍽️' },
    { name: 'Indian', emoji: '🍛' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Chinese', emoji: '🥢' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Salads', emoji: '🥗' },
    { name: 'Beverages', emoji: '🥤' }
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/restaurants`);
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (err) {
        console.error("Fetch restaurants error:", err);
        setError("Could not load restaurants. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants based on search query and cuisine selection
  useEffect(() => {
    let result = restaurants;

    if (selectedCuisine !== 'All') {
      result = result.filter(r => r.cuisine.toLowerCase() === selectedCuisine.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisine.toLowerCase().includes(q)
      );
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCuisine, restaurants]);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section Banner */}
      <div className="relative bg-gradient-to-r from-red-600 to-zomatoRed py-16 px-4 sm:px-6 lg:px-8 text-center text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60"></div>
        <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Discover the best food & drinks in town
          </h1>
          <p className="text-sm md:text-base text-red-100 max-w-xl font-medium">
            Explore premium local dining options and order delicious meals directly to your doorstep.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl flex items-center p-2 border border-red-500/20 mt-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-white">
            <span className="pl-3 pr-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-800 focus:outline-none placeholder-gray-400 bg-transparent py-2 text-sm md:text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Cuisine Filters */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <span>Inspiration for your first order</span>
            <span className="h-1.5 w-1.5 rounded-full bg-zomatoRed"></span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x scroll-smooth">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine.name}
                onClick={() => setSelectedCuisine(cuisine.name)}
                className={`snap-start flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap active:scale-95 transition-all duration-200 border ${
                  selectedCuisine === cuisine.name
                    ? 'bg-zomatoRed text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-red-100 hover:bg-red-50/30'
                }`}
              >
                <span className="text-base">{cuisine.emoji}</span>
                <span>{cuisine.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display */}
        {loading ? (
          /* Loading Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse h-80">
                <div className="bg-gray-200 aspect-[4/3] w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 bg-white border border-red-100 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Connection Error</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-zomatoRed text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-red-600 active:scale-95 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">No restaurants match</h3>
            <p className="text-gray-500 text-sm mb-4">We couldn't find any results matching your search terms or cuisine filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('All');
              }}
              className="text-zomatoRed border border-zomatoRed hover:bg-red-50 font-bold text-xs px-5 py-2 rounded-full transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Grid list */
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <span>Best food delivery options near you</span>
              <span className="h-1.5 w-1.5 rounded-full bg-zomatoRed"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((res) => (
                <RestaurantCard
                  key={res.id}
                  id={res.id}
                  name={res.name}
                  cuisine={res.cuisine}
                  rating={res.rating}
                  deliveryTime={res.deliveryTime}
                  image={res.image}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
