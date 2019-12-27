import _ from "lodash";
import {
    Event,
    GetVariableArgs,
    MethodContext,
    SetVariableArgs,
    SquareFaceArgs,
} from "./cassette-def";
import { DynoFinder } from "./dyno-finder";
import { EventDispatcher } from "./event-dispatcher";
import { DynoInst, GameState } from "./game-state";

const unimplemented = () => {};

export class MethodContextMaker {
    private state: GameState;
    private dynoFinder: DynoFinder;

    private static instance: MethodContextMaker;
    private static eventDispatcher: EventDispatcher;

    static getInstance() {
        if (!MethodContextMaker.instance) {
            MethodContextMaker.instance = new MethodContextMaker();
            MethodContextMaker.eventDispatcher = EventDispatcher.getInstance();
        }

        return MethodContextMaker.instance;
    }

    private constructor() {
        this.state = GameState.getInstance();
        this.dynoFinder = DynoFinder.getInstance();
    }

    public make(dynObj: DynoInst): MethodContext {
        const context: MethodContext = {
            actions: {
                fireEvent: MethodContextMaker.fireEvent.bind(dynObj),
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
            dynos: this.dynoFinder,
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

    static fireEvent(event: Event) {
        return MethodContextMaker.eventDispatcher.dispatch(event);
    }
}
