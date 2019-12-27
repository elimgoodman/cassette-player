import { CassetteDef, GameObject, MethodContext, Scene } from "./cassette-def";

const gameTile: GameObject = {
    id: "game-tile",
    face: {
        type: "dynamic",
        generator: $ctx => {
            const boardState = $ctx.helpers.getBoardState();
            switch (boardState) {
                case "X":
                    return $ctx.faces.image({ assetId: "x-image" });
                case "O":
                    return $ctx.faces.image({ assetId: "o-image" });
                default:
                    return $ctx.faces.square({
                        length: 100,
                        color: "#aaffaa",
                    });
            }
        },
    },
    events: [
        {
            event: "click",
            handler: ($event, $ctx) => {
                const {
                    actions: { getVariable, fireEvent },
                    currentScene,
                    helpers,
                    self,
                } = $ctx;

                const playerTurn = getVariable({
                    object: currentScene,
                    path: "playerTurn",
                });

                // FIXME: add this back in later
                // if ($event.metadata.controllerId !== playerTurn) {
                //     return;
                // }

                const boardState = helpers.getBoardState();
                if (boardState !== undefined) return;

                fireEvent({
                    target: currentScene,
                    eventName: "move-made",
                    payload: {
                        x: getVariable({
                            object: self,
                            path: "boardX",
                        }),
                        y: getVariable({
                            object: self,
                            path: "boardY",
                        }),
                        mark: playerTurn === "player1" ? "X" : "O",
                    },
                });
            },
        },
    ],
    variables: [
        {
            name: "boardX",
            value: 0,
        },
        {
            name: "boardY",
            value: 0,
        },
        {
            name: "scale",
            value: 0.2,
        },
    ],
    helpers: [
        {
            id: "getBoardState",
            handler: ($ctx: MethodContext) => {
                const {
                    actions: { getVariable },
                    currentScene,
                } = $ctx;

                const boardX = getVariable({
                    object: $ctx.self,
                    path: "boardX",
                });

                const boardY = getVariable({
                    object: $ctx.self,
                    path: "boardY",
                });

                const boardState = getVariable({
                    object: currentScene,
                    path: "boardState",
                });

                return boardState[boardX][boardY];
            },
        },
    ],
    assets: [
        { id: "x-image", path: "x-image.png" },
        { id: "o-image", path: "o-image.png" },
    ],
};

const boardScene: Scene = {
    id: "game-board",
    variables: [
        {
            name: "boardState",
            value: Array(3).fill(Array(3)), // TODO: generate the right size matrix here
        },
        {
            name: "playerTurn",
            value: "player1",
        },
    ],
    gameObjects: [
        {
            id: "vertical-line",
            face: {
                type: "line",
                length: [200, 20],
                color: "#000000",
                width: 2,
            },
            events: [
                {
                    event: "tick",
                    handler: (_event, $ctx) => {
                        $ctx.actions.updateVariable({
                            object: $ctx.self,
                            path: "x",
                            updater: x => x + 1,
                        });
                    },
                },
            ],
        },
        gameTile,
        {
            id: "test-text",
            face: {
                type: "dynamic-text",
                color: "#000000",
                fontSize: 30,
                generator: $ctx => {
                    const line = $ctx.dynos.getById("vertical-line")!;
                    return $ctx.actions.getVariable({
                        object: line,
                        path: "x",
                    });
                },
            },
            variables: [
                {
                    name: "x",
                    value: 100,
                },
                {
                    name: "y",
                    value: 100,
                },
            ],
        },
    ],
    events: [
        {
            event: "move-made",
            handler: ($event, $ctx) => {
                const { x, y, mark } = $event.payload;
                const boardState = $ctx.actions.getVariable({
                    object: $ctx.self,
                    path: "boardState",
                });

                boardState[x][y] = mark;
                $ctx.actions.setVariable({
                    object: $ctx.self,
                    path: "boardState",
                    value: boardState,
                });

                const winner = $ctx.helpers.checkWinner(); // TODO: implement checkWinner
                if (winner) {
                    $ctx.actions.goToScene({
                        sceneId: "winner-screen",
                        variables: { winner },
                    });
                }
            },
        },
    ],
    helpers: [
        {
            id: "checkWinner",
            handler: $ctx => {
                // FIXME: IMPLEMENT
            },
        },
    ],
};

export const ticTacToe: CassetteDef = {
    controllers: [
        { id: "player1", type: "mouse" },
        { id: "player2", type: "mouse" },
    ],
    scenes: [
        boardScene,
        {
            id: "winner-screen",
            gameObjects: [
                {
                    id: "winner-text",
                    face: {
                        type: "dynamic-text",
                        generator: $ctx => {
                            const winner = $ctx.actions.getVariable({
                                object: $ctx.self,
                                path: "winner",
                            });

                            return `${winner} is the winner!`;
                        },
                        fontSize: 12,
                        color: "#000000",
                    },
                },
            ],
            variables: [
                {
                    name: "winner",
                    value: null,
                },
            ],
        },
    ],
    defaultSceneId: "game-board",
};
