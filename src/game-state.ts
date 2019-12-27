import _ from "lodash";
import {
    CassetteDef,
    EventHandlerCallback,
    FaceConfig,
    MethodContext,
    Scene,
} from "./cassette-def";
import { CassetteLibrary } from "./cassette-library";
import { cassetteDefToDynObj, sceneDefToDynObjs } from "./cassette-loading";

export enum CommonVariable {
    X = "x",
    Y = "y",
    SCALE = "scale",
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

export type HelperCallback = ($ctx: MethodContext) => void;

export type Variables = { [key: string]: any };
export type EventHandlers = { [eventName: string]: EventHandlerCallback };
export type Helpers = { [name: string]: HelperCallback };

export interface DynoInst {
    id: string;
    uuid: string;
    variables: Variables;
    eventHandlers: EventHandlers;
    helpers: Helpers;
    face?: FaceConfig;
}

class DynoManager {
    private root: DynoInst;
    private currentScene: DynoInst | null = null;
    private sceneObjects: DynoInst[] = [];

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
    public getSceneObjs(): DynoInst[] {
        return [this.root, this.currentScene!].concat(this.sceneObjects);
    }

    public getSceneDyno(): DynoInst {
        return this.currentScene!;
    }
}

export class GameState {
    private sceneManager: SceneManager;
    private dynoManager: DynoManager;

    private static instance: GameState;

    static getInstance(): GameState {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }

        return GameState.instance;
    }

    private constructor() {
        const cassetteDef = CassetteLibrary.getInstance().getCurrentCassette();
        const { scenes: sceneDefs, defaultSceneId } = cassetteDef;

        this.sceneManager = new SceneManager(sceneDefs);
        this.dynoManager = new DynoManager(cassetteDef);

        this.loadScene(defaultSceneId);
    }

    public filterSceneObjects(pred: (obj: DynoInst) => boolean): DynoInst[] {
        return this.dynoManager.getSceneObjs().filter(pred);
    }

    public allSceneObjects(): DynoInst[] {
        return this.dynoManager.getSceneObjs();
    }

    public getCurrentSceneDOI(): DynoInst {
        return this.dynoManager.getSceneDyno();
    }

    private loadScene(sceneId: string): void {
        const scene = this.sceneManager.getSceneById(sceneId);
        if (scene) {
            this.dynoManager.addAllForScene(scene);
            this.sceneManager.currentScene = scene;
        }
    }
}
