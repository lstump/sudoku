import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getLayoutSelector, getWorksheetSelector } from "../features/gameSlice";
import { GameMgr } from "../lib/GameMgr";
import Tile from "./Tile";


function Board() {
	var grid = useSelector(getLayoutSelector());
	var worksheet = useSelector(getWorksheetSelector());

	console.log("Board - grid: ", grid);

	let boxes = [];
	for (let boxIndex = 0; boxIndex < grid.length; boxIndex++) {
		let cells = [];
		for (let cellIndex = 0; cellIndex < grid.length; cellIndex++) {
			cells.push(
				(
					<Tile
						row={GameMgr.getRowIndexFmBoxIndexAndValueIndex(boxIndex, cellIndex)}
						col={GameMgr.getColIndexFmBoxIndexAndValueIndex(boxIndex, cellIndex)}
						key={cellIndex}
					></Tile>
				)
			);
		}
		boxes.push((<div className="sudoku-box sudoku-grid" key={boxIndex}>{cells}</div>));
	}


	return (
		<div className="sudoku-game">
			<div className="sudoku-title">Sudoku</div>
			<div className="sudoku-grid sudoku-top">
				{
					boxes
				}
			</div>
		</div>
	);
}

export default Board;