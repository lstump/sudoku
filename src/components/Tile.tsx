import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getErrorsSelector, getInitialLayoutSelector, getLayoutSelector, getWorksheetSelector } from "../features/gameSlice";
import { FocusedColSelector, FocusedRowSelector, setFocus } from "../features/guiSlice";
import { GameError } from "../lib/GameMgr";

var counter = 0;

function Tile({ row, col }: { row: number, col: number }) {
	counter++;

	const layout = useSelector(getLayoutSelector());
	const initialLayout = useSelector(getInitialLayoutSelector());
	const worksheet = useSelector(getWorksheetSelector());
	const errors = useSelector(getErrorsSelector());
	const selectedRow = useSelector(FocusedRowSelector());
	const selectedCol = useSelector(FocusedColSelector());

	const dispatch = useDispatch();

	var value = layout[row][col];
	var helper = worksheet[row][col];
	var isFocused = (selectedRow === row && selectedCol === col);
	var readonly = (null !== initialLayout[row][col]);
	var hasError = false;
	if (!readonly && null !== value) {
		errors.forEach((eachError: GameError) => {
			eachError.duplicateCoordinates.forEach(eachCoordinate => {
				if (eachCoordinate.row === row && eachCoordinate.col === col) {
					hasError = true;
				}
			})
		})
	}

	var [prevHelper, setPrevHelper] = useState(helper);
	var [prevCounter, setPrevCounter] = useState(counter);

	if (row === 0 && col === 0) {
		console.log("counter: " + counter);
		console.log(`Tile for (${row}, ${col}, counter: ${counter}, prevCounter: ${prevCounter}`);
		console.log(`Tile for (${row}, ${col}, \r\nh: ${JSON.stringify(helper)}, \r\np: ${JSON.stringify(prevHelper)}`);
	}

	var className = "sudoku-tile sudoku-grid-element" + (isFocused ? " focused" : " not-focused") + (readonly ? " readonly" : " editable") + (hasError ? " error" : " noerror") + (value === null ? " sudoku-grid" : "");
	//console.log(`${row}, ${col} selected: ${selectedRow}, ${selectedCol} isFocused: ${isFocused}, className: ${className}`);

	//console.log(`${row}, ${col} worksheet:`, worksheet);

	function onClick() {
		//debugger;
		//console.log(`setting focus from ${selectedRow}, ${selectedCol} to ${row}, ${col}`)
		dispatch(setFocus({ row: row, col: col }));
		
		//console.log("ref:", ref);
		if (ref.current) {
			ref.current.focus();
		}
		setPrevHelper(helper);
	}
	const ref = useRef<HTMLDivElement>(null);

	if (value === null) {
		return (
			<div className={className} tabIndex={0} ref={ref} onClick={() => onClick()} onFocus={() => dispatch(setFocus({ row: row, col: col }))}>
				{
					Object.keys(helper).map((eachKey) => {
						var on = helper[eachKey];
						var prevOn = prevHelper[eachKey];
						return (<div className={"sudoku-cell" + (on ? " selected" : " unselected") + (prevOn !== on ? " updated" : "")} key={eachKey}>{on ? eachKey : " "}</div>);
					})
				}
			</div>);
	}
	if (readonly) {
		return (<div className={ className }>{value}</div>)
	}
	return (<div className={className} tabIndex={0} ref={ref} onClick={() => onClick()}>{value}</div>)
}

export default Tile;