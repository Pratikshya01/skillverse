import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Async thunk for initiating checkout
export const initiateCheckout = createAsyncThunk(
  'payment/initiateCheckout',
  async ({ amount, courseIds, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/checkout', {
        amount,
        courseIds,
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for getting Razorpay key
export const getRazorpayKey = createAsyncThunk(
  'payment/getRazorpayKey',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/getkey');
      return response.data.key;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  razorpayKey: null,
  order: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(initiateCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Checkout failed';
      })
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.razorpayKey = action.payload;
      })
      .addCase(getRazorpayKey.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get Razorpay key';
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;

export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectRazorpayKey = (state) => state.payment.razorpayKey;
export const selectOrder = (state) => state.payment.order;

export default paymentSlice.reducer; 