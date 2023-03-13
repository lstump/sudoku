import React, { useState } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getLayoutSelector, getWorksheetSelector, setGameValue, setWorksheetCol, setWorksheetRow, setWorksheetValue, setWorksheetBox, clearWorksheet } from "../features/gameSlice";
import { FocusedColSelector, FocusedRowSelector } from "../features/guiSlice";
import { GameMgr, SudokuTile } from "../lib/GameMgr";
import { GroupType } from "../lib/Grid";


function EditPanel() {
	var grid = useSelector(getLayoutSelector());
	var worksheet = useSelector(getWorksheetSelector());


	const row = useSelector(FocusedRowSelector());
	const col = useSelector(FocusedColSelector());

	const dispatch = useDispatch();

	if (row === null || col === null) {
		return null;
	}
	const box = GameMgr.getBoxIndexFmRowAndCol(row, col);
	console.log(`EditPanel, row: ${row}, col: ${col}, box: ${box}`);


	const currentValue = grid[row][col];
	const helper = worksheet[row][col]


	//console.log("EditPanel - gameMgr: ", gameMgr);
	var array = new Array(grid.length).fill(0).map((each, index) => index + 1);

	function toggleValues(value: number, type: GroupType | null) {
		console.log(`entering EditPanel.toggleValues, value:  ${value}, row: ${row}, col: ${col}, currentValue: ${currentValue}`)
		if (row === null || col === null) {
			return;
		}
		const isOn = helper[value]; // is this number toggled ON in the worksheet?
		// do the things
		console.log("toggle " + value + " for " + type);
		switch (type) {
			case null:
				if (currentValue === value) {
					dispatch(setGameValue({ row: row, col: col, value: null }));
				} else {
					dispatch(setGameValue({ row: row, col: col, value: value as SudokuTile }));
				}
				break;
			case GroupType.cell:
				dispatch(setWorksheetValue({ row: row, col: col, cell: value, value: !isOn }));
				break;
			case GroupType.row:
				dispatch(setWorksheetRow({ row: row, cell: value, value: !isOn }));
				break;
			case GroupType.col:
				dispatch(setWorksheetCol({ col: col, cell: value, value: !isOn }));
				break;
			case GroupType.box:
				dispatch(setWorksheetBox({ box: box, cell: value, value: !isOn }));
				break;
		}
	}


	return (
		<div className="panel edit-panel">
			<div className="title">Edit Panel</div>
			<div className="sudoku-grid">
				{
					array.map(each => {
						const isGuess = currentValue === each; // is this number guessed in the tile?
						const isOn = helper[each]; // is this number toggled ON in the worksheet?
						//								<button className={currentValue === each ? "guess selected-guess" : "guess unselected-guess"} key={each} onClick={(ev) => toggleValues(each, null)}>{each}</button>)
						return (
							<div className="sudoku-button-grid button-element" key={each}>
								<Form.Check
									aria-label="Select"
									onChange={() => toggleValues(each, null)}
									checked={currentValue === each}
									className="button-guess"
									type="checkbox"
									as="input"
									id={`${each}.guess`}
									label={each}
								/>
								<FormCheck aria-label={String(each)} checked={isOn} onClick={(ev) => toggleValues(each, GroupType.cell)}/>
								<Button variant="outline-dark" onClick={(ev) => toggleValues(each, GroupType.row)}>→</Button>
								<Button variant="outline-dark" onClick={(ev) => toggleValues(each, GroupType.col)}>↓</Button>
								<Button variant="outline-dark" onClick={(ev) => toggleValues(each, GroupType.box)}>☐</Button>
							</div>
						);
					})
				}
			</div>
		</div>
	);
}

export default EditPanel;