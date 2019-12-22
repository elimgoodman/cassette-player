import {
    MethodContext,
    GetVariableArgs,
    SetVariableArgs,
} from "./cassette-def";
import { DynamicObjectInst, GameState } from "./game-state";
import { AssetManager } from "./asset-manager";

const unimplemented = () => {};

export class MethodContextMaker {
    private state: GameState;
    private assetManager: AssetManager;

    private static instance: MethodContextMaker;

    static getInstance() {
        if (!MethodContextMaker.instance) {
            MethodContextMaker.instance = new MethodContextMaker();
        }

        return MethodContextMaker.instance;
    }

    private constructor() {
        this.state = GameState.getInstance();
        this.assetManager = AssetManager.getInstance();
    }

    public make(dynObj: DynamicObjectInst): MethodContext {
        return {
            actions: {
                fireEvent: unimplemented,
                getVariable: MethodContextMaker.getVariable.bind(dynObj),
                goToScene: unimplemented,
                setVariable: MethodContextMaker.setVariable.bind(dynObj),
                updateVariable: args => {
                    const { object, path, updater } = args;

                    const old = MethodContextMaker.getVariable({
                        object,
                        path,
                    });

                    MethodContextMaker.setVariable({
                        object,
                        path,
                        value: updater(old),
                    });
                },
            },
            currentScene: this.state.getCurrentSceneDOI(),
            helpers: {},
            self: dynObj,
            faces: {
                image: ({ assetId }) => ({
                    type: "image",
                    assetId: assetId,
                }),
                square: unimplemented,
            },
        };
    }

    static setVariable(args: SetVariableArgs) {
        const { path, object, value } = args;
        object.variables[path] = value;
    }

    static getVariable(args: GetVariableArgs) {
        const { object, path } = args;
        return object.variables[path];
    }
}
