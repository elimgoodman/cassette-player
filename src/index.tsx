// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassette";
import { render } from "./render";
import { GameState } from "./game-state";

// ReactDOM.render(<App />, document.getElementById("root"));

const canvas = document.getElementById("cassette-canvas")! as HTMLCanvasElement;
const gameState = new GameState(ticTacToe);

requestAnimationFrame(() => {
    render(gameState, canvas);
});
