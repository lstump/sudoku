import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import guiReducer from '../features/guiSlice';
import gameReducer from '../features/gameSlice';
import undoable from 'redux-undo';

export const store = configureStore({ 
  reducer: {
    gui: guiReducer,
    game: undoable(gameReducer)
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
