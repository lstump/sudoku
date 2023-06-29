import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { GameError, GameMgr, SudokuHelperTile, SudokuTile } from '../lib/GameMgr';
import { Layout } from '../lib/Grid';
import { getSettings, setSettings } from '../lib/SettingsMgr';

export type GameState = {
  layout: Layout<SudokuTile>,
  worksheet: Layout<SudokuHelperTile>,
  initialLayout: Layout<SudokuTile>,
  errors: Array<GameError>
};

const mtGame: Layout<SudokuTile> = [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null]
];

const testGame1: Layout<SudokuTile> = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9]
];

const testGame2: Layout<SudokuTile> = [
  [null, null, null, null, null, null, null, null, 7],
  [null, 3, 2, 1, null, null, null, 5, null],
  [null, 6, 8, 5, null, null, 1, null, null],
  [null, 8, 9, 7, null, 4, null, null, null],
  [null, null, null, null, 3, null, null, null, null],
  [null, null, null, 8, null, 1, 6, 2, null],
  [null, null, 5, null, null, 9, 3, 6, null],
  [null, 9, null, null, null, 6, 2, 8, null],
  [3, null, null, null, null, null, null, null, null]
];

const testGame3: Layout<SudokuTile> = [
  [null, null, 7, null, 2, null, 5, null, null],
  [null, 8, null, 4, null, 3, null, 6, null],
  [1, null, null, null, 6, null, null, null, 4],
  [null, 3, null, null, null, null, null, 2, null],
  [2, null, 6, null, null, null, 7, null, 1],
  [null, 7, null, null, null, null, null, 4, null],
  [7, null, null, null, 5, null, null, null, 6],
  [null, 6, null, 8, null, 7, null, 9, null],
  [null, null, 9, null, 3, null, 4, null, null]
];

export const initGameState = ():GameState => {
  
  return {
    //layout: new Array(9).fill([]).map(each => new Array(9).fill(null as SudokuTile)),
    layout: JSON.parse(JSON.stringify(testGame3)),
    initialLayout: testGame3,
    worksheet: new Array(9).fill([]).map(each => new Array(9).fill(null).map(each => {
      var helper: SudokuHelperTile = {};
      for (var i = 1; i <= 9; i++) { 
        helper[i] = true;
      }
      return helper;
    })),
    errors: []
  };
};

const defaultState = initGameState();
const initialState: GameState = getSettings("gameState", defaultState);

const save = (state: GameState) => {
  setSettings("gameState", state);
}

export const GameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setInitialGame: (state: GameState, action: PayloadAction<{layout: Layout<SudokuTile>}>) => {
      state.initialLayout = action.payload.layout;
      state.layout = JSON.parse(JSON.stringify(action.payload.layout));
      state.errors = GameMgr.checkLayout(state.layout);
      save(state);
    },
    setGameValue: (state: GameState, action: PayloadAction<{row: number, col: number, value: SudokuTile}>) => {
      state.layout[action.payload.row][action.payload.col] = action.payload.value;
      state.errors = GameMgr.checkLayout(state.layout);
      save(state);
    },
    setWorksheetEntry: (state: GameState, action: PayloadAction<{row: number, col: number, value: SudokuHelperTile}>) => {
      state.worksheet[action.payload.row][action.payload.col] = action.payload.value;
      save(state);
    },
    setWorksheetValue: (state: GameState, action: PayloadAction<{row: number, col: number, cell: number, value: boolean}>) => {
      state.worksheet[action.payload.row][action.payload.col][action.payload.cell] = action.payload.value;
      save(state);
    },
    setWorksheetRow: (state: GameState, action: PayloadAction<{ row: number, cell: number, value: boolean }>) => {
      for (var col = 0; col < state.worksheet.length; col++) {
        state.worksheet[action.payload.row][col][action.payload.cell] = action.payload.value;
      }
      save(state);
    },
    setWorksheetCol: (state: GameState, action: PayloadAction<{ col: number, cell: number, value: boolean }>) => {
      for (var row = 0; row < state.worksheet.length; row++) {
        state.worksheet[row][action.payload.col][action.payload.cell] = action.payload.value;
      }
      save(state);
    },
    setWorksheetBox: (state: GameState, action: PayloadAction<{ box: number, cell: number, value: boolean }>) => {
      var coordinates = GameMgr.getBoxCoordinates(action.payload.box);
      console.log("entering setWorksheetBox, coordinates: ", coordinates);
      for (var index = 0; index < coordinates.length; index++) {
        var coordinate = coordinates[index];
        state.worksheet[coordinate[0]][coordinate[1]][action.payload.cell] = action.payload.value;
      }
      save(state);
    },
    resetWorksheet: (state: GameState) => {
      state.worksheet = initGameState().worksheet;
      save(state);
    },
    resetGame: (state: GameState) => {
      state.layout = state.initialLayout;
      state.worksheet = initGameState().worksheet;
      save(state);
    },
    clearInvalidValues: (state: GameState) => {
      state.worksheet = GameMgr.clearInvalidValues(state.layout, state.worksheet);
      save(state);
    }
  }
});

export const { setGameValue, setWorksheetEntry, setWorksheetValue, setWorksheetRow, setWorksheetCol, setWorksheetBox, resetWorksheet, resetGame, clearInvalidValues} = GameSlice.actions;

export const getLayoutSelector = () => (state: RootState) => state.game.present.layout;
export const getPrevLayoutSelector = () => (state: RootState) => (state.game.past.length ? state.game.past[state.game.past.length-1].layout: state.game.present.layout);
export const getInitialLayoutSelector = () => (state: RootState) => state.game.present.initialLayout;
export const getWorksheetSelector = () => (state: RootState) => state.game.present.worksheet;
export const getPrevWorksheetSelector = () => (state: RootState) => (state.game.past.length ? state.game.past[state.game.past.length-1].worksheet: state.game.present.worksheet);
export const getErrorsSelector = () => (state: RootState) => state.game.present.errors;
export const getGameSize = () => (state: RootState) => state.game.present.layout.length;

export default GameSlice.reducer;
