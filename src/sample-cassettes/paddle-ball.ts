import { Badge, CassetteDef } from "../cassette-def";

const kbControlBadge: Badge = {
    id: "kb-control",
    events: [
        {
            event: "keydown",
            handler: ($event, $ctx) => {
                const { key } = $event.payload;
                switch (key) {
                    case "ArrowLeft":
                        $ctx.actions.updateVariable({
                            object: $ctx.self,
                            path: "x",
                            updater: x => x - 1,
                        });
                        break;
                    case "ArrowRight":
                        $ctx.actions.updateVariable({
                            object: $ctx.self,
                            path: "x",
                            updater: x => x + 1,
                        });
                        break;
                }
            },
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
                    ],
                    badges: [kbControlBadge],
                },
            ],
        },
    ],
};
