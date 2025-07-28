import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import burgerConstructor from './slices/burgerConstructor';
import ingredients from './slices/ingredientsSlice';
import orders from './slices/orderSlice';
import feeds from './slices/feedsSlice';
import user from './slices/userSlice';

const rootReducer = combineReducers({
  burgerConstructor,
  ingredients,
  orders,
  feeds,
  user
});

const isDev = process.env.NODE_ENV !== 'production';

export const store = configureStore({
  reducer: rootReducer,
  devTools: isDev
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
