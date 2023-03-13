import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import EditPanel from './components/EditPanel';
import ControlPanel from './components/ControlPanel';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

function App() {
  return (
    <div className="sudoku-page">
      <ControlPanel></ControlPanel>
      <Board></Board>
      <EditPanel></EditPanel>
    </div>
  );

}

export default App;
