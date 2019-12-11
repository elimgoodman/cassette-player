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

    constructor(state: GameState, assetManager: AssetManager) {
        this.state = state;
        this.assetManager = assetManager;
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
            assets: {
                getById: (args: { id: string }) => {
                    return this.assetManager.getById(args.id);
                },
            },
            currentScene: this.state.getCurrentSceneDOI(),
            helpers: {},
            self: dynObj,
            shapes: {
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
