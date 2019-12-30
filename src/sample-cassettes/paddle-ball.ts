import { BadgeDef, CassetteDef } from "../cassette-def";

const kbControlBadge: BadgeDef = {
    id: "kb-control",
    events: [
        {
            event: "keydown",
            handler: ($event, $ctx) => {
                const moveSpeed = $ctx.actions.getVariable({
                    object: $ctx.self,
                    path: "moveSpeed",
                });

                const { key } = $event.payload;
                switch (key) {
                    case "ArrowLeft":
                        $ctx.actions.updateVariable({
                            object: $ctx.self,
                            path: "x",
                            updater: x => x - moveSpeed,
                        });
                        break;
                    case "ArrowRight":
                        $ctx.actions.updateVariable({
                            object: $ctx.self,
                            path: "x",
                            updater: x => x + moveSpeed,
                        });
                        break;
                }
            },
        },
    ],
    variables: [
        {
            name: "moveSpeed",
            value: 3,
        },
    ],
};

export const paddleBall: CassetteDef = {
    controllers: [
        {
            id: "kb",
            type: "keyboard",
        },
    ],
    defaultSceneId: "default-scene",
    scenes: [
        {
            id: "default-scene",
            type: "static",
            gameObjects: [
                {
                    id: "paddle",
                    face: {
                        type: "rect",
                        color: "#aabbcc",
                        width: 30,
                        height: 10,
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
                    badges: [kbControlBadge],
                },
                {
                    id: "paddle-2",
                    face: {
                        type: "rect",
                        color: "#ccbbaa",
                        width: 30,
                        height: 10,
                    },
                    variables: [
                        {
                            name: "x",
                            value: 100,
                        },
                        {
                            name: "y",
                            value: 80,
                        },
                        {
                            name: "moveSpeed",
                            value: 5,
                        },
                    ],
                    badges: [kbControlBadge],
                },
                {
                    id: "ball",
                    face: {
                        type: "circle",
                        radius: 10,
                        color: "#aaffaa",
                    },
                    variables: [
                        {
                            name: "x",
                            value: 10,
                        },
                        {
                            name: "y",
                            value: 10,
                        },
                    ],
                },
            ],
        },
    ],
};
