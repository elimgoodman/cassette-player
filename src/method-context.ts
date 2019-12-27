import _ from "lodash";
import {
    Event,
    GetVariableArgs,
    GoToSceneArgs,
    MethodContext,
    SetVariableArgs,
    SquareFaceArgs,
} from "./cassette-def";
import { DynoFinder } from "./dyno-finder";
import { DynoManager } from "./dyno-manager";
import { EventDispatcher } from "./event-dispatcher";
import { DynoInst } from "./game-state";
import { SceneManager } from "./scene-manager";

export class MethodContextMaker {
    private dynoFinder: DynoFinder;
    private sceneManager: SceneManager;
    private dynoManager: DynoManager;

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
        this.dynoFinder = DynoFinder.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.dynoManager = DynoManager.getInstance();
    }

    public make(dynObj: DynoInst): MethodContext {
        const context: MethodContext = {
            actions: {
                fireEvent: MethodContextMaker.fireEvent.bind(dynObj),
                getVariable: MethodContextMaker.getVariable.bind(dynObj),
                goToScene: args => this.goToScene(args),
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
            currentScene: this.dynoManager.getSceneDyno(),
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

    // FIXME: I don't think these should be static...
    // Oh - they're this way because other things call them
    // refactor!
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

    private goToScene(args: GoToSceneArgs) {
        const { sceneId, variables } = args;
        this.sceneManager.goToScene(sceneId, variables);
    }
}
