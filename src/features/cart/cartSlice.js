import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.total += action.payload.price;
      }
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item._id === action.payload);
      if (itemIndex !== -1) {
        state.total -= state.items[itemIndex].price;
        state.items.splice(itemIndex, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemsCount = (state) => state.cart.items.length;

export default cartSlice.reducer; 