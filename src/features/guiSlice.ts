import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { SudokuTile } from '../lib/GameMgr';

export type GuiState = {
  focusedRow: number | null,
  focusedColumn: number | null,
  focusedValue: number | null
};

export const initGuiState = () => {
  return {
    focusedRow: null,
    focusedColumn: null,
    focusedValue: null
  };
};

const initialState = initGuiState();

export const GuiSlice = createSlice({
  name: 'gui',
  initialState,
  reducers: {
    setFocus: (state: GuiState, action: PayloadAction<{row: number | null, col: number| null}>) => {
      state.focusedRow = action.payload.row;
      state.focusedColumn = action.payload.col;
    },
    setFocusedValue: (state: GuiState, action: PayloadAction<SudokuTile>) => {
      state.focusedValue = action.payload;
    }
  }
});

export const { setFocus, setFocusedValue } = GuiSlice.actions;
export const FocusedRowSelector = () => (state: RootState) => state.gui.focusedRow;
export const FocusedColSelector = () => (state: RootState) => state.gui.focusedColumn;
export const FocusedValSelector = () => (state: RootState) => state.gui.focusedValue;

export const getGuiSelector = () => (state: RootState) => state.gui;

export default GuiSlice.reducer;
