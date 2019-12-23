import {
    MethodContext,
    GetVariableArgs,
    SetVariableArgs,
    SquareFaceArgs,
} from "./cassette-def";
import { DynamicObjectInst, GameState } from "./game-state";
import { AssetManager } from "./asset-manager";
import _ from "lodash";

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
        const context: MethodContext = {
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
            helpers: _.mapValues(dynObj.helpers, callback => {
                return () => {
                    return callback(context);
                };
            }),
            self: dynObj,
            faces: {
                image: ({ assetId }) => ({
                    type: "image",
                    assetId: assetId,
                }),
                square: (args: SquareFaceArgs) => ({
                    type: "square",
                    ...args,
                }),
            },
        };

        return context;
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
