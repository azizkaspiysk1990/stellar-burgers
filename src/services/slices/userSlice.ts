import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie, getCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  userData: TUser | null;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  userData: null,
  userOrders: [],
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const fetchUser = createAsyncThunk('user/get', async () => getUserApi());

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/getOrders',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = getCookie('accessToken');

      const result = await getOrdersApi();
      return result;
    } catch (error) {
      if (
        (error as any)?.message === 'jwt expired' ||
        (error as any)?.status === 401 ||
        (error as any)?.status === 403
      ) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch(setIsAuthChecked(true));
      }
      return rejectWithValue(
        (error as any)?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');

    if (token) {
      try {
        const userData = await getUserApi();
        dispatch(fetchUser.fulfilled(userData, '', undefined));
        dispatch(setIsAuthChecked(true));
      } catch (error) {
        if (
          (error as any)?.message === 'jwt expired' ||
          (error as any)?.status === 403 ||
          (error as any)?.message === 'No access token found'
        ) {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        }
        dispatch(setIsAuthChecked(true));
      }
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })

      .addCase(logoutUser.pending, (state) => {
        state.userData = null;
        state.isLoading = false;
      })

      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userData = null;
        state.isLoading = false;
        state.error = action.error.message!;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.userData = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
  selectors: {
    getUser: (state) => state.userData,
    getUserOrders: (state) => state.userOrders,
    getLoadingStatus: (state) => state.isLoading,
    getAuthCheckedStatus: (state) => state.isAuthChecked,
    getError: (state) => state.error
  }
});

export const {
  getUser,
  getUserOrders,
  getLoadingStatus,
  getAuthCheckedStatus,
  getError
} = slice.selectors;

export const { setIsAuthChecked, resetError } = slice.actions;

export default slice.reducer;
