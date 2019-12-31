import { CassetteDef } from "../cassette-def";

export const dynamicScene: CassetteDef = {
    defaultSceneId: "default-scene",
    controllers: [],
    scenes: [
        {
            id: "default-scene",
            events: [
                {
                    event: "load",
                    handler: ($event, $ctx) => {
                        const prefab = $ctx.prefabs.getById("block")!;
                        $ctx.actions.spawn({
                            gameObject: prefab,
                            variables: {
                                x: 10,
                                y: 10,
                            },
                        });
                    },
                },
            ],
        },
    ],
    prefabs: [
        {
            id: "block",
            face: {
                type: "dynamic",
                generator: $ctx => {
                    return $ctx.faces.square({
                        color: $ctx.actions.getVariable({
                            object: $ctx.self,
                            path: "color",
                        }),
                        length: 20,
                    });
                },
            },
            variables: [
                {
                    name: "x",
                    value: 0,
                },
                {
                    name: "y",
                    value: 0,
                },
                {
                    name: "color",
                    value: "#00dd00",
                },
            ],
        },
    ],
};
