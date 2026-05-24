import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ id, name, cuisine, rating, deliveryTime, image }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Delivery Time Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-800 shadow-sm border border-gray-100">
          {deliveryTime}
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-zomatoRed transition-colors duration-200 line-clamp-1">
              {name}
            </h3>
            {/* Rating Badge */}
            <div className="flex items-center gap-0.5 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-md shadow-sm">
              <span>{rating}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-1 mb-3">
            {cuisine} • Zomato Safe Delivery
          </p>
        </div>

        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span>Closes in 45 mins</span>
          <span className="font-semibold text-gray-600">₹200 for one</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
