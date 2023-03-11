
// the layout is an array (rows) of arrays (columns) of tiles
export type Layout<T> = Array<Array<T>>;

export enum GroupType {
	cell,
	row,
	col,
	box
}


export class Grid<T> {
	layout: Layout<T>;
	size: number = 9;
	//worksheet: SudokuWorksheet = new Array(9).map(each => new Array(9).map(each => new Array(9).map(eachGuess => true)));

	constructor(initialLayout: Layout<T>, size: number) {
		this.size = size;
		if (initialLayout.length !== this.SIZE) {
			throw Error("Initial layout is wrong size.  Expected " + this.SIZE + " rows, actual: " + initialLayout.length);
		}
		initialLayout.forEach((eachRow, rowIndex) => {
			if (eachRow.length !== this.SIZE) {
				throw Error("Initial layout is wrong size.  Expected " + this.SIZE + " cols, actual: " + eachRow.length + " for row " + rowIndex);
			}
		})
		this.layout = initialLayout;
	}

	get SIZE() {
		return this.size;
	}

	setValue = (rowIndex: number, colIndex: number, tile: T) => {
		if (rowIndex < 0 || rowIndex >= this.SIZE) {
			throw Error("row out of range " + rowIndex);
		}
		if (colIndex < 0 || colIndex >= this.SIZE) {
			throw Error("col out of range " + colIndex);
		}
		this.layout[rowIndex][colIndex] = tile;
	}

	getValueFmGroupTypeAndValueIndex = (groupType: GroupType, groupIndex: number, valueIndex: number): T | null => {
		switch(groupType) {
			case GroupType.row:
				return this.getValueFmRowIndexAndValueIndex(groupIndex, valueIndex);
			case GroupType.col:
				return this.getValueFmColIndexAndValueIndex(groupIndex, valueIndex);
			case GroupType.box:
				return this.getValueFmBoxIndexAndValueIndex(groupIndex, valueIndex);
			default:
				return null;
			}
	}

	getValueFmRowIndexAndValueIndex = (rowIndex: number, valueIndex: number): T => {
		if (rowIndex < 0 || rowIndex >= this.SIZE) {
			throw Error("row out of range " + rowIndex);
		}
		return this.layout[rowIndex][valueIndex];
	}

	getValueFmColIndexAndValueIndex = (colIndex: number, valueIndex: number): T => {
		if (colIndex < 0 || colIndex >= this.SIZE) {
			throw Error("col out of range " + colIndex);
		}
		return this.layout[valueIndex][colIndex];
	}

	getRowIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return 3 * Math.floor(boxIndex / 3) + Math.floor(valueIndex / 3);
	}

	getColIndexFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		return 3 * (boxIndex % 3) + (valueIndex % 3);
	}

	getValueFmBoxIndexAndValueIndex = (boxIndex: number, valueIndex: number) => {
		var rowIndex = this.getRowIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
		var colIndex = this.getColIndexFmBoxIndexAndValueIndex(boxIndex, valueIndex);
		return this.layout[rowIndex][colIndex];
	}
}