interface DynamicObject {
    variables?: Variable[];
    events?: EventHandler[];
    helpers?: Helper[];
}

interface Helper {
    id: string;
    handler: ($ctx: MethodContext) => any; // TODO: what context goes in here?
}

interface Controller {
    id: string;
    type: "mouse" | "keyboard" | "gamepad";
}

interface ShapeFaceConfig {
    type: "line";
    length: [number, number];
    color: string;
    width: number;
}

type Color = string;

interface DynamicFaceConfig {
    type: "dynamic";
    generator: ($ctx: MethodContext) => any; // TODO: define this return type
}

interface DynamicTextFaceConfig {
    type: "dynamic-text";
    fontSize: number;
    color: Color;
    generator: ($ctx: MethodContext) => string;
}

type FaceConfig = ShapeFaceConfig | DynamicFaceConfig | DynamicTextFaceConfig;

type GameObject = {
    id: string;
    face: FaceConfig;
} & DynamicObject;

type Scene = {
    id: string;
    gameObjects: GameObject[];
} & DynamicObject;

interface Variable {
    name: string;
    type: "int" | "float" | "string" | "list" | "map" | "matrix";
    value: any;
}

interface Event {
    eventName: string;
    metadata: any;
    payload: any;
}

interface EventHandler {
    event: "tick" | "keydown" | "click" | string;
    handler: ($event: Event, $ctx: MethodContext) => void; // TODO: what context goes in here?
}

type CassetteDef = {
    controllers: Controller[];
    scenes: Scene[];
    defaultSceneId: string;
} & DynamicObject;

type Asset = any;
type Target = DynamicObject | DynamicObject[];

interface Actions {
    getVariable: (args: {
        object: DynamicObject;
        path: string;
        badge?: string;
    }) => any;
    fireEvent: (args: {
        target: Target;
        eventName: string;
        payload: any;
    }) => any;
    setVariable: (args: {
        object: DynamicObject;
        path: string;
        value: any;
        badge?: string;
    }) => void;
    goToScene: (args: { sceneId: string; variables?: any }) => void;
}

interface AssetHelpers {
    getById(args: { id: string }): Asset;
}

// FIXME: what relationship should this have to FaceConfig?
// TODO: have some kind of color type
interface ShapeHelpers {
    square: (args: { length: number; color: string }) => any;
}

interface MethodContext {
    actions: Actions;
    self: DynamicObject;
    helpers: any;
    assets: AssetHelpers;
    shapes: ShapeHelpers;
    currentScene: Scene;
}

/*



    EXAMPLE



    */

const gameTile: GameObject = {
    id: "game-tile",
    face: {
        type: "dynamic",
        generator: $ctx => {
            const boardState = $ctx.helpers.getBoardState();
            switch (boardState) {
                case "X":
                    return $ctx.assets.getById({
                        id: "x-image",
                    });
                case "O":
                    return $ctx.assets.getById({
                        id: "o-image",
                    });
                default:
                    return $ctx.shapes.square({
                        length: 10,
                        color: "#efefef",
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

                if ($event.metadata.controllerId !== playerTurn) {
                    return;
                }

                const boardState = helpers.getBoardState();
                if (boardState !== null) return;

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
            type: "int",
            value: "0",
        },
        {
            name: "boardY",
            type: "int",
            value: "0",
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

                // TODO: this probably needs to be more specific to matrices...
                return getVariable({
                    object: currentScene,
                    path: `boardState.${boardX}.${boardY}`,
                });
            },
        },
    ],
};

const boardScene: Scene = {
    id: "game-board",
    variables: [
        {
            name: "boardState",
            type: "matrix",
            value: [[]], // TODO: generate the right size matrix here
        },
        {
            name: "playerTurn",
            type: "string",
            value: "player1",
        },
    ],
    gameObjects: [
        {
            id: "vertical-line",
            face: {
                type: "line",
                length: [0, 20],
                color: "#FFFFFF",
                width: 2,
            },
        },
        gameTile,
    ],
    events: [
        {
            event: "move-made",
            handler: ($event, $ctx) => {
                const { x, y, mark } = $event.payload;
                $ctx.actions.setVariable({
                    object: $ctx.self,
                    path: `boardState.${x}.${y}`,
                    value: mark,
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
                    type: "string",
                    value: null,
                },
            ],
        },
    ],
    defaultSceneId: "game-board",
};
