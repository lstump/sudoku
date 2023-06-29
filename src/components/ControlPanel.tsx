import React, { useState } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";
import { getLayoutSelector, getWorksheetSelector, setGameValue, setWorksheetCol, setWorksheetRow, setWorksheetValue, setWorksheetBox, resetWorksheet, clearInvalidValues, resetGame } from "../features/gameSlice";
import { FocusedColSelector, FocusedRowSelector, FocusedValSelector, setFocusedValue } from "../features/guiSlice";
import { GameMgr, SudokuTile } from "../lib/GameMgr";
import { GroupType } from "../lib/Grid";


function ControlPanel() {

	const dispatch = useDispatch();

	const focusedValue = useSelector(FocusedValSelector());

	return (
		<div className="panel control-panel">
			<div className="title">Control Panel</div>
			<div className="button-panel d-flex flex-column">
				<div className="sub-title">Worksheet</div><br/>
				<div className="button-row">
					<Button onClick={(ev) => dispatch(clearInvalidValues())}>Clear Invalid Values</Button>
					<Button onClick={() => dispatch(resetWorksheet())}>Reset Worksheet</Button>
					<Button onClick={() => dispatch(resetGame())}>Reset Game</Button>
				</div><br/>
				<div className="button-row">
					<Button onClick={() => dispatch(ActionCreators.undo())}>Undo</Button>
					<Button onClick={() => dispatch(ActionCreators.redo())}>Redo</Button>
				</div><br/>
			</div>
			<div className="sudoku-grid">
				{
					([1, 2, 3, 4, 5, 6, 7, 8, 9] as Array<SudokuTile>).map(eachValue => {
						return (
							<div key={eachValue}>
								<input
									className="form-check-input"
									type="radio"
									name={"highlight" + eachValue}
									id={"highlight" + eachValue}
									checked={focusedValue === eachValue}
									onChange={() => dispatch(setFocusedValue(eachValue))}
								/>
								<label className="form-check-label" htmlFor={"highlight" + eachValue}>
									{eachValue}
								</label>
							</div>
						);
					})
				}
			</div>
		</div>
	);
}

export default ControlPanel;