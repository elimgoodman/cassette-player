// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassette";
import { Renderer } from "./renderer";
import { GameState } from "./game-state";
import { EventDispatcher } from "./event-dispatcher";
import { AssetManager } from "./asset-manager";

// ReactDOM.render(<App />, document.getElementById("root"));

const canvas = document.getElementById("cassette-canvas")! as HTMLCanvasElement;
const gameState = new GameState(ticTacToe);
const assetManager = new AssetManager(ticTacToe);
const dispatcher = new EventDispatcher(gameState, assetManager);
const renderer = new Renderer(gameState, canvas, assetManager);

(async () => {
    await assetManager.loadAll();
})();

const gameLoop = () => {
    dispatcher.dispatch(EventDispatcher.TICK_EVENT);
    renderer.render();
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
