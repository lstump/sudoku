import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import guiReducer from '../features/guiSlice';
import gameReducer from '../features/gameSlice';

export const store = configureStore({ 
  reducer: {
    gui: guiReducer,
    game: gameReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
