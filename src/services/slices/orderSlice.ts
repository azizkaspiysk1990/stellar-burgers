import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store'; // обязательно импортируй RootState

interface OrderState {
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunk для отправки заказа
export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
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
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка при создании заказа';
      });
  }
});

export const selectOrderState = (state: RootState) => state.orders;

export const selectOrderData = (state: RootState) => selectOrderState(state).currentOrder;
export const selectOrderLoading = (state: RootState) => selectOrderState(state).loading;
export const selectOrderError = (state: RootState) => selectOrderState(state).error;

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
