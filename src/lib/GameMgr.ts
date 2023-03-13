import { Grid, GroupType, Layout } from "./Grid";

export type SudokuTile = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export type SudokuHelperTile = { [value: number | string]: boolean };

export type GameCoordinates = { row: number, col: number };

export type GameError = {
	groupType: GroupType,
	groupIndex: number,
	duplicateIndices: Array<number>,
	value: number,
	duplicateCoordinates: Array<GameCoordinates>
}

const testGame: Layout<SudokuTile> = [
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

const gameSize = 9;

export class GameMgr {
	_size: number = gameSize;
	_grid: Grid<SudokuTile>;
	_initialGrid: Grid<SudokuTile>;
	_worksheet: Grid<SudokuHelperTile>;
	_errors: Array<GameError> = [];

	constructor() {
		this._grid = new Grid(testGame, gameSize);
		this._initialGrid = new Grid(JSON.parse(JSON.stringify(testGame)), gameSize);
		var initialWorksheet = new Array(gameSize).fill(0).map(eachRow => new Array(gameSize).fill(0).map((eachColumn) => {
			var helperTile: SudokuHelperTile = {};
			for (var i = 1; i <= gameSize; i++) {
				helperTile[i] = false;
			}
			return helperTile;
		})
		);
		this._worksheet = new Grid(initialWorksheet, gameSize);
		console.log("GameMgr - this: ", this);
	}

	get SIZE(): number {
		return this._size;
	}

	get grid(): Grid<SudokuTile> {
		return this._grid;
	}

	get worksheet(): Grid<SudokuHelperTile> {
		return this._worksheet;
	}

	static getRowIndexFmGroup = (groupType: GroupType, groupIndex: number, valueIndex: number) => {
		switch(groupType) {
			case GroupType.row:
				return groupIndex;
			case GroupType.col:
				return valueIndex;
			case GroupType.box:
				return GameMgr.getRowIndexFmBoxIndexAndValueIndex(groupIndex, valueIndex);
			default:
				return 0;
			}
	}

	static getColIndexFmGroup = (groupType: GroupType, groupIndex: number, valueIndex: number) => {
		switch(groupType) {
			case GroupType.row:
				return valueIndex;
			case GroupType.col:
				return groupIndex;
			case GroupType.box:
				return GameMgr.getColIndexFmBoxIndexAndValueIndex(groupIndex, valueIndex);
			default:
				return 0;
			}
	}

	static getRowIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return 3 * Math.floor(boxIndex / 3) + Math.floor(valueIndex / 3);
	}

	static getColIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return 3 * (boxIndex % 3) + (valueIndex % 3);
	}

	static getBoxIndexFmRowAndCol = (row: number, col: number) => {
		return Math.ceil((col + 1) / 3) + (Math.floor(row / 3) * 3) - 1;
	}

	static getBoxCoordinates = (box: number) => {
		var coordinates: Array<Array<number>> = [];
		for (var index = 0; index < gameSize; index++) {
			coordinates.push([GameMgr.getRowIndexFmBoxIndexAndValueIndex(box, index), GameMgr.getColIndexFmBoxIndexAndValueIndex(box, index)]);
		}
		return coordinates;
	}

	static checkLayout = (layout: Layout<SudokuTile>) => {
		var gameErrors: Array<GameError> = [];

		[GroupType.row, GroupType.col, GroupType.box].forEach(eachType => {
			for (var groupIndex = 0; groupIndex < 9; groupIndex++) {
				// frequencies is a data dictionary of possible values along with the frequency they occur
				// in this group.  Only allowed 1!!
				var frequencies: { [value: number | string]: Array<number> } = {};
				var badCoordinates: { [value: number | string]: Array<GameCoordinates> } = {};
				for (var valueIndex = 0; valueIndex < layout.length; valueIndex++) {
					var value = GameMgr.getValueFmGroupTypeAndValueIndex(layout, eachType, groupIndex, valueIndex);
					if (value !== null) {
						if (!frequencies[value]) {
							frequencies[value] = [];
						}
						if (!badCoordinates[value]) {
							badCoordinates[value] = [];
						}
						frequencies[value].push(valueIndex);
						badCoordinates[value].push({
							row: GameMgr.getRowIndexFmGroup(eachType, groupIndex, valueIndex),
							col: GameMgr.getColIndexFmGroup(eachType, groupIndex, valueIndex),
						});
					}
				}
				Object.keys(frequencies).forEach((eachValue) => {
					var eachFrequencies = frequencies[eachValue];
					// if there's more than one of a value
					if (eachFrequencies.length > 1) {
						gameErrors.push(
							{
								groupType: eachType,
								groupIndex: groupIndex,
								duplicateIndices: eachFrequencies,
								value: value as number,
								duplicateCoordinates: badCoordinates[eachValue]
							});
					}
				});
				console.log(`for type ${eachType}, groupIndex: ${groupIndex}, frequencies: `, frequencies);
			}
		});
		console.log(`gameErrors: `, gameErrors);
		return gameErrors;
	}


	static clearInvalidValues = (layout: Layout<SudokuTile>, worksheet: Layout<SudokuHelperTile>) => {

		var newWorksheet = JSON.parse(JSON.stringify(worksheet)) as any as Layout<SudokuHelperTile>;

		[GroupType.row, GroupType.col, GroupType.box].forEach(eachType => {
			for (var groupIndex = 0; groupIndex < 9; groupIndex++) {
				// mapOfOccurringValues is a data dictionary of values that already occur in this group
				var occurringValues: Array<SudokuTile> = [];
				for (var valueIndex = 0; valueIndex < layout.length; valueIndex++) {
					var value = GameMgr.getValueFmGroupTypeAndValueIndex(layout, eachType, groupIndex, valueIndex);
					if (null !== value) {
						occurringValues.push(value);
					}
				}
				// now mapOfOccurringValues is set to a boolean map where each entry in the map is true if the value exists in the group
				// so walk the group one more time and turn OFF the helper cell entries that cannot occur
				for (var valueIndex = 0; valueIndex < layout.length; valueIndex++) {
					var helper = GameMgr.getValueFmGroupTypeAndValueIndex(newWorksheet, eachType, groupIndex, valueIndex);
					if (helper) {
						occurringValues.forEach(eachOccurringValue => {
							if (eachOccurringValue !== null && helper) {
								helper[eachOccurringValue] = false;
							}
						});
					}
				}
			}
		});
		return newWorksheet;
	}

	static getValueFmGroupTypeAndValueIndex<T>(layout: Layout<T>, groupType: GroupType, groupIndex: number, valueIndex: number): T | null {
		return layout[GameMgr.getRowIndexFmGroup(groupType, groupIndex, valueIndex)][GameMgr.getColIndexFmGroup(groupType, groupIndex, valueIndex)];
	}

	static getValueFmRowIndexAndValueIndex<T>(layout: Layout<T>, rowIndex: number, valueIndex: number): T  {
		if (rowIndex < 0 || rowIndex >= layout.length) {
			throw Error("row out of range " + rowIndex);
		}
		return layout[rowIndex][valueIndex];
	}

	static getValueFmColIndexAndValueIndex<T>(layout: Layout<T>, colIndex: number, valueIndex: number): T {
		if (colIndex < 0 || colIndex >= layout.length) {
			throw Error("col out of range " + colIndex);
		}
		return layout[valueIndex][colIndex];
	}

	static getValueFmBoxIndexAndValueIndex<T>(layout: Layout<T>, boxIndex: number, valueIndex: number) {
		var rowIndex = this.getRowIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
		var colIndex = this.getColIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
		return layout[rowIndex][colIndex];
	}

	/*
	getRowIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return this.grid.getRowIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
	}

	getColIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return this.grid.getColIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
	}*/

	checkLayout = () => {
		return GameMgr.checkLayout(this.grid.layout);
	}

	getValue = (rowIndex: number | null, colIndex: number | null) => {
		if (null === rowIndex || null === colIndex) {
			return null;
		}
		return this.grid.getValueFmRowIndexAndValueIndex(rowIndex, colIndex);
	}

	setValue = (rowIndex: number, colIndex: number, value: SudokuTile) => {
		this.grid.setValue(rowIndex, colIndex, value);
		this._errors = this.checkLayout();
	}

	getHelper = (rowIndex: number, colIndex: number) => {
		return this.worksheet.getValueFmRowIndexAndValueIndex(rowIndex, colIndex);
	}


	isReadonly = (rowIndex: number, colIndex: number) => {
		return (null !== this._initialGrid.getValueFmRowIndexAndValueIndex(rowIndex, colIndex));
	}
}


export const theGameMgr = new GameMgr;