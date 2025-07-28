import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type ConstructorState = {
  selectedBun: TIngredient | null;
  items: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  selectedBun: null,
  items: [],
};

const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addItem: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() },
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.selectedBun = action.payload;
        } else {
          state.items.push(action.payload);
        }
      },
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    reorderItem(
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const { index, direction } = action.payload;
      const swapIndex = direction === 'up' ? index - 1 : index + 1;

      if (swapIndex >= 0 && swapIndex < state.items.length) {
        const temp = state.items[index];
        state.items[index] = state.items[swapIndex];
        state.items[swapIndex] = temp;
      }
    },

    clearConstructor(state) {
      state.selectedBun = null;
      state.items = [];
    },
  },
  selectors: {
    getAllConstructorData: (state) => state,
  }
});

export const {
  addItem,
  removeItem,
  reorderItem,
  clearConstructor,
} = burgerConstructorSlice.actions;

export const { getAllConstructorData } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
