import {
    Scene,
    CassetteDef,
    EventHandlerCallback,
    GameObject,
    FaceConfig,
} from "./cassette-def";
import _ from "lodash";
import { cassetteDefToDynObj, sceneDefToDynObjs } from "./cassette-loading";

export enum CommonVariable {
    X = "X",
    Y = "Y",
}

class SceneManager {
    private currentScene: Scene | null = null;
    private sceneDefs: Scene[];

    constructor(sceneDefs: Scene[]) {
        this.sceneDefs = sceneDefs;
    }

    public getSceneById(sceneId: string): Scene | undefined {
        return _.find(this.sceneDefs, sceneDef => sceneDef.id === sceneId);
    }
}

export type Variables = { [key: string]: any };
export type EventHandlers = { [eventName: string]: EventHandlerCallback };

export interface DynamicObject {
    id: string;
    uuid: string;
    variables: Variables;
    eventHandlers: EventHandlers;
    face?: FaceConfig;
}

class DynamicObjectManager {
    private root: DynamicObject;
    private currentScene: DynamicObject | null = null;
    private sceneObjects: DynamicObject[] = [];

    constructor(cassetteDef: CassetteDef) {
        this.root = cassetteDefToDynObj(cassetteDef);
    }

    public addAllForScene(sceneDef: Scene): void {
        const { sceneDynObj, sceneObjs } = sceneDefToDynObjs(sceneDef);

        this.currentScene = sceneDynObj;
        this.sceneObjects = sceneObjs;
    }

    // FIXME: if this ends up being expensive (we'll prob be calling it a fair bit),
    // can easily precompute and store
    public getSceneObjs(): DynamicObject[] {
        return [this.root, this.currentScene!].concat(this.sceneObjects);
    }
}

export class GameState {
    private sceneManager: SceneManager;
    private dynObjManager: DynamicObjectManager;

    constructor(cassetteDef: CassetteDef) {
        const { scenes: sceneDefs, defaultSceneId } = cassetteDef;

        this.sceneManager = new SceneManager(sceneDefs);
        this.dynObjManager = new DynamicObjectManager(cassetteDef);

        this.loadScene(defaultSceneId);
    }

    public getRenderableObjects(): DynamicObject[] {
        return this.dynObjManager
            .getSceneObjs()
            .filter(dynObj => !_.isUndefined(dynObj.face));
    }

    private loadScene(sceneId: string): void {
        const scene = this.sceneManager.getSceneById(sceneId);
        if (scene) {
            this.dynObjManager.addAllForScene(scene);
        }
    }
}
