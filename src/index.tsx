// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassette";
import { Renderer } from "./renderer";
import { GameState } from "./game-state";
import { EventDispatcher } from "./event-dispatcher";
import { AssetManager } from "./asset-manager";
import { CassetteLibrary } from "./cassette-library";
import { CollisionDetector } from "./collision-detector";

// ReactDOM.render(<App />, document.getElementById("root"));
CassetteLibrary.init([ticTacToe]);

const canvas = document.getElementById("cassette-canvas")! as HTMLCanvasElement;
const dispatcher = EventDispatcher.getInstance();
const collisionDetector = CollisionDetector.getInstance();
const renderer = new Renderer(canvas);

canvas.addEventListener("click", event => {
    const { clientX, clientY } = event;
    const dynos = collisionDetector.getObjectsAtPoint(clientX, clientY);
    dispatcher.dispatch({
        eventName: "click",
        target: dynos,
    });
});

(async () => {
    await AssetManager.getInstance().loadAll();
})();

const gameLoop = () => {
    dispatcher.dispatch(EventDispatcher.TICK_EVENT);
    renderer.render();
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
