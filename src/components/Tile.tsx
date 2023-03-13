import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getErrorsSelector, getInitialLayoutSelector, getLayoutSelector, getPrevWorksheetSelector, getWorksheetSelector } from "../features/gameSlice";
import { FocusedColSelector, FocusedRowSelector, setFocus } from "../features/guiSlice";
import { GameError } from "../lib/GameMgr";

function Tile({ row, col }: { row: number, col: number }) {
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
	const prevWorksheet = useSelector(getPrevWorksheetSelector());
	const prevHelper = prevWorksheet[row][col];

	var className = "sudoku-tile sudoku-grid-element" + (isFocused ? " focused" : " not-focused") + (readonly ? " readonly" : " editable") + (hasError ? " error" : " noerror") + (value === null ? " sudoku-grid" : "");

	function onClick() {
		//debugger;
		//console.log(`setting focus from ${selectedRow}, ${selectedCol} to ${row}, ${col}`)
		dispatch(setFocus({ row: row, col: col }));
		
		//console.log("ref:", ref);
		if (ref.current) {
			ref.current.focus();
		}	
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