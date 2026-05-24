import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('zomato_cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [activeRestaurantId, setActiveRestaurantId] = useState(() => {
    return localStorage.getItem('zomato_active_restaurant_id') || null;
  });

  // Keep cart items and active restaurant ID synced with localStorage
  useEffect(() => {
    localStorage.setItem('zomato_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setActiveRestaurantId(null);
      localStorage.removeItem('zomato_active_restaurant_id');
    } else if (activeRestaurantId) {
      localStorage.setItem('zomato_active_restaurant_id', activeRestaurantId);
    }
  }, [cartItems, activeRestaurantId]);

  const addToCart = (item, restaurantId) => {
    // If cart has items from a different restaurant, ask user to clear first
    if (activeRestaurantId && activeRestaurantId !== restaurantId) {
      const confirmClear = window.confirm(
        "You already have items from another restaurant in your cart. Would you like to discard them and start a new order with this restaurant?"
      );
      if (confirmClear) {
        setCartItems([{ ...item, quantity: 1, restaurantId }]);
        setActiveRestaurantId(restaurantId);
      }
      return;
    }

    // Set active restaurant if this is the first item
    if (!activeRestaurantId) {
      setActiveRestaurantId(restaurantId);
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, restaurantId }];
    });
  };

  const updateQuantity = (itemId, change) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveRestaurantId(null);
    localStorage.removeItem('zomato_cart');
    localStorage.removeItem('zomato_active_restaurant_id');
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        activeRestaurantId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
