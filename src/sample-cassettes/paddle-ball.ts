import { BadgeDef, CassetteDef } from "../cassette-def";

const physicalBadge: BadgeDef = {
    id: "physical",
    events: [
        {
            event: "tick",
            handler: ($event, $ctx) => {
                const { elapsed } = $event.payload;
                const { self } = $ctx;
                const gx = 0 * elapsed;
                const gy = 0;

                self.vx += self.ax * elapsed + gx;
                self.vy += self.ay * elapsed + gy;
                self.x += self.vx * elapsed;
                self.y += self.vy * elapsed;
            },
        },
    ],
    variables: [
        {
            name: "vx",
            value: 0.2,
        },
        {
            name: "vy",
            value: 0,
        },
        {
            name: "ax",
            value: 0,
        },
        {
            name: "ay",
            value: 0,
        },
    ],
};

const kbControlBadge: BadgeDef = {
    id: "kb-control",
    events: [
        {
            event: "keydown",
            handler: ($event, $ctx) => {
                const { moveSpeed } = $ctx.self;

                const { key } = $event.payload;
                switch (key) {
                    case "ArrowLeft":
                        $ctx.self.x += moveSpeed;
                        break;
                    case "ArrowRight":
                        $ctx.self.x -= moveSpeed;
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
                            value: 100,
                        },
                        {
                            name: "y",
                            value: 100,
                        },
                    ],
                    badges: [physicalBadge],
                },
            ],
        },
    ],
};
