// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassette";
import { render } from "./render";
import { GameState } from "./game-state";
import { EventDispatcher } from "./event-dispatcher";

// ReactDOM.render(<App />, document.getElementById("root"));

const canvas = document.getElementById("cassette-canvas")! as HTMLCanvasElement;
const gameState = new GameState(ticTacToe);
const dispatcher = new EventDispatcher(gameState);

const gameLoop = () => {
    dispatcher.dispatch(EventDispatcher.TICK_EVENT);
    render(gameState, canvas);
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
