// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassette";
import { Renderer } from "./renderer";
import { GameState } from "./game-state";
import { EventDispatcher } from "./event-dispatcher";
import { AssetManager } from "./asset-manager";
import { CassetteLibrary } from "./cassette-library";

// ReactDOM.render(<App />, document.getElementById("root"));
CassetteLibrary.init([ticTacToe]);

const canvas = document.getElementById("cassette-canvas")! as HTMLCanvasElement;
const dispatcher = EventDispatcher.getInstance();
const renderer = new Renderer(canvas);

(async () => {
    await AssetManager.getInstance().loadAll();
})();

const gameLoop = () => {
    dispatcher.dispatch(EventDispatcher.TICK_EVENT);
    renderer.render();
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
