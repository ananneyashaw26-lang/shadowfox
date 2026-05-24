import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const FoodCard = ({ item, restaurantId }) => {
  const { addToCart, cartItems, updateQuantity } = useContext(CartContext);

  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Let's decide Veg/Non-Veg dynamically based on some ID math
  const isVeg = parseInt(item.id) % 2 === 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center gap-4">
      {/* Food Details */}
      <div className="flex-grow flex flex-col gap-1.5 max-w-[65%]">
        <div className="flex items-center gap-2">
          {/* Veg/Non-Veg indicator */}
          <span className={`inline-block w-4 h-4 border ${isVeg ? 'border-green-600' : 'border-red-600'} p-0.5 rounded-sm flex items-center justify-center`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
          </span>
          {item.price > 200 && (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
              Bestseller
            </span>
          )}
        </div>
        
        <h4 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1">{item.name}</h4>
        <span className="font-semibold text-gray-900 text-sm">₹{item.price}</span>
        
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Food Image and Action Button */}
      <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex flex-col justify-center items-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-bold">
            zomato
          </div>
        )}

        {/* Add / Quantity Button Overlaid on Bottom of Image */}
        <div className="absolute bottom-1.5 w-[85%] left-1/2 -translate-x-1/2 shadow-md rounded-lg overflow-hidden border border-red-100">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-white text-zomatoRed font-extrabold text-xs h-7">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-full flex items-center justify-center hover:bg-red-50 text-base transition-colors duration-150"
              >
                -
              </button>
              <span className="text-gray-800 select-none text-xs">{quantity}</span>
              <button
                onClick={() => addToCart(item, restaurantId)}
                className="w-8 h-full flex items-center justify-center hover:bg-red-50 text-base transition-colors duration-150"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, restaurantId)}
              className="w-full bg-white text-zomatoRed hover:bg-red-50 font-bold text-xs h-7 py-1 px-3 flex items-center justify-center transition-all duration-200"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
