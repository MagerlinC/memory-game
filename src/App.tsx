import React from "react";
import "./App.scss";
import Board from "./components/board/board";

function App() {
  // Number of different icon pairs
  const numPairs = 6;
  return (
    <div className="App">
      <header className="App-header">
        <div className="welcome-section">Welcome to the Memory Game!</div>
      </header>
      <div className="body">
        <Board boardSize={numPairs}></Board>
      </div>
    </div>
  );
}

export default App;
