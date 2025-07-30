import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { fetchUserOrders } from './userSlice';
import { getFeeds } from './feedsSlice';

interface OrderState {
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (ingredientIds: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredientIds);

    setTimeout(() => {
      dispatch(fetchUserOrders());
    }, 1000);

    setTimeout(() => {
      dispatch(getFeeds());
    }, 1500);

    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        submitOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка при создании заказа';
      });
  }
});

export const selectOrderState = (state: RootState) => state.orders;

export const selectOrderData = (state: RootState) =>
  selectOrderState(state).currentOrder;
export const selectOrderLoading = (state: RootState) =>
  selectOrderState(state).loading;
export const selectOrderError = (state: RootState) =>
  selectOrderState(state).error;

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
