import { CassetteDef, GameObject } from "../cassette-def";

export const dynamicScene: CassetteDef = {
    defaultSceneId: "default-scene",
    controllers: [],
    scenes: [
        {
            id: "default-scene",
            type: "dynamic",
            loader: $builder => {
                const objs: GameObject[] = [];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        objs.push(
                            $builder.fromPrefab({
                                prefabId: "block",
                                id: `block-${i}-${j}`,
                                variables: {
                                    x: i * 22,
                                    y: j * 22,
                                    color: i === 2 ? "#ee00ee" : "#00ee0",
                                },
                            })
                        );
                    }
                }
                return objs;
            },
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
