import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedsState = {
  ordersData: TOrdersData;
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedsState = {
  ordersData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  order: null,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk<TOrdersData>(
  'feeds/getFeeds',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const getFeedById = createAsyncThunk<TOrder, number>(
  'feeds/getById',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const slice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ordersData = action.payload;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })

      .addCase(getFeedById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.order = action.payload;
      })
      .addCase(getFeedById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
  selectors: {
    getOrdersData: (state) => state.ordersData.orders,
    getFeedData: (state) => state.order,
    getLoadingStatus: (state) => state.isLoading,
    getTotal: (state) => state.ordersData.total,
    getTotalToday: (state) => state.ordersData.totalToday
  }
});

export const {
  getOrdersData,
  getFeedData,
  getLoadingStatus,
  getTotal,
  getTotalToday
} = slice.selectors;

export default slice.reducer;
