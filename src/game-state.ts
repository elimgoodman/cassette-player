import _ from "lodash";

import {
    CassetteDef,
    EventHandlerCallback,
    FaceConfig,
    GameObject,
    Scene,
} from "./cassette-def";
import { cassetteDefToDynObj, sceneDefToDynObjs } from "./cassette-loading";

export enum CommonVariable {
    X = "X",
    Y = "Y",
}

class SceneManager {
    public currentScene: Scene | null = null;
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

export interface DynamicObjectInst {
    id: string;
    uuid: string;
    variables: Variables;
    eventHandlers: EventHandlers;
    face?: FaceConfig;
}

class DynamicObjectManager {
    private root: DynamicObjectInst;
    private currentScene: DynamicObjectInst | null = null;
    private sceneObjects: DynamicObjectInst[] = [];

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
    public getSceneObjs(): DynamicObjectInst[] {
        return [this.root, this.currentScene!].concat(this.sceneObjects);
    }

    public getSceneDOI(): DynamicObjectInst {
        return this.currentScene!;
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

    public filterSceneObjects(
        pred: (obj: DynamicObjectInst) => boolean
    ): DynamicObjectInst[] {
        return this.dynObjManager.getSceneObjs().filter(pred);
    }

    public getCurrentSceneDOI(): DynamicObjectInst {
        return this.dynObjManager.getSceneDOI();
    }

    private loadScene(sceneId: string): void {
        const scene = this.sceneManager.getSceneById(sceneId);
        if (scene) {
            this.dynObjManager.addAllForScene(scene);
            this.sceneManager.currentScene = scene;
        }
    }
}
