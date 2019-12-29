// import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import { ticTacToe } from "./sample-cassettes/tic-tac-toe";
import { Renderer } from "./renderer";
import { EventDispatcher } from "./event-dispatcher";
import { AssetManager } from "./asset-manager";
import { CassetteLibrary } from "./cassette-library";
import { CollisionDetector } from "./collision-detector";
import { paddleBall } from "./sample-cassettes/paddle-ball";

// ReactDOM.render(<App />, document.getElementById("root"));
CassetteLibrary.init([paddleBall, ticTacToe]);

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

window.addEventListener("keydown", event => {
    const { key } = event;
    dispatcher.dispatch({
        eventName: "keydown",
        payload: { key },
    });
});

(async () => {
    await AssetManager.getInstance().loadAll();
})();

let start: number | null = null;
const gameLoop = (timestamp: number) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    dispatcher.dispatch(EventDispatcher.TICK_EVENT(elapsed));
    renderer.render();
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
