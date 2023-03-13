import React, { useState } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";
import { getLayoutSelector, getWorksheetSelector, setGameValue, setWorksheetCol, setWorksheetRow, setWorksheetValue, setWorksheetBox, clearWorksheet, clearInvalidValues } from "../features/gameSlice";
import { FocusedColSelector, FocusedRowSelector } from "../features/guiSlice";
import { GameMgr, SudokuTile } from "../lib/GameMgr";
import { GroupType } from "../lib/Grid";


function ControlPanel() {

	const dispatch = useDispatch();

	return (
		<div className="panel control-panel">
			<div className="title">Control Panel</div>
			<div className="button-panel">
				<div className="sub-title">Worksheet</div>
				<div>
					<Button onClick={(ev) => dispatch(clearInvalidValues())}>Clear Invalid Values</Button>
					<Button onClick={() => dispatch(clearWorksheet())}>Clear Worksheet</Button>
				</div>
				<div>
					<Button onClick={() => dispatch(ActionCreators.undo())}>Undo</Button>
					<Button onClick={() => dispatch(ActionCreators.redo())}>Redo</Button>
				</div>
			</div>
		</div>
	);
}

export default ControlPanel;