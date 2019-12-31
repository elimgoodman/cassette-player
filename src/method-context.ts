import _ from "lodash";
import {
    GetVariableArgs,
    GoToSceneArgs,
    MethodContext,
    SetVariableArgs,
    SquareFaceArgs,
} from "./cassette-def";
import { gameObjToDyno } from "./cassette-loading";
import { DynoFinder } from "./dyno-finder";
import { DynoManager } from "./dyno-manager";
import { EventDispatcher } from "./event-dispatcher";
import { DynoInst } from "./game-state";
import { PrefabManager } from "./prefab-manager";
import { SceneManager } from "./scene-manager";

export class MethodContextMaker {
    private dynoFinder: DynoFinder;
    // private sceneManager: SceneManager;
    private dynoManager: DynoManager;
    private prefabManager: PrefabManager;
    // private eventDispatcher: EventDispatcher;

    private static instance: MethodContextMaker;

    static getInstance() {
        if (!MethodContextMaker.instance) {
            MethodContextMaker.instance = new MethodContextMaker();
        }

        return MethodContextMaker.instance;
    }

    private constructor() {
        this.dynoFinder = DynoFinder.getInstance();
        // this.sceneManager = SceneManager.getInstance();
        this.dynoManager = DynoManager.getInstance();
        this.prefabManager = PrefabManager.getInstance();
        // this.eventDispatcher = EventDispatcher.getInstance();
    }

    public make(dynObj: DynoInst): MethodContext {
        const context: MethodContext = {
            actions: {
                fireEvent: event => {
                    EventDispatcher.getInstance().dispatch(event);
                },
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
                spawn: args => {
                    const { variables, gameObject, id } = args;
                    const obj = _.cloneDeep(gameObject);
                    if (id) {
                        obj.id = id;
                    }

                    // FIXME: yuckkkkkkkk
                    // FIXME: this is totally fucked - fix this for real
                    if (obj.variables && variables) {
                        _.forEach(variables, (value, key) => {
                            for (const variable of obj.variables!) {
                                if (variable.name === key) {
                                    variable.value = value;
                                }
                            }
                        });
                    }

                    const dynoInst = gameObjToDyno(obj);
                    this.dynoManager.add(dynoInst);
                    return dynoInst;
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
            prefabs: this.prefabManager,
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

    private goToScene(args: GoToSceneArgs) {
        const { sceneId, variables } = args;
        SceneManager.getInstance().goToScene(sceneId, variables);
    }
}
