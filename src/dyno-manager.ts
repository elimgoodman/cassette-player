import { SceneDef } from "./cassette-def";
import { CassetteLibrary } from "./cassette-library";
import { cassetteDefToDynObj, sceneDefToDynObjs } from "./cassette-loading";
import { DynoInst } from "./game-state";

export class DynoManager {
    private root: DynoInst;
    private currentScene: DynoInst | null = null;
    private sceneObjects: DynoInst[] = [];

    private static instance: DynoManager;
    private constructor() {
        const cassetteDef = CassetteLibrary.getInstance().getCurrentCassette();
        this.root = cassetteDefToDynObj(cassetteDef);
    }

    public static getInstance(): DynoManager {
        if (!DynoManager.instance) {
            DynoManager.instance = new DynoManager();
        }

        return DynoManager.instance;
    }

    public addAllForScene(sceneDef: SceneDef): void {
        const { sceneDynObj, sceneObjs } = sceneDefToDynObjs(sceneDef);
        this.currentScene = sceneDynObj;
        this.sceneObjects = sceneObjs;
    }

    // FIXME: if this ends up being expensive (we'll prob be calling it a fair bit),
    // can easily precompute and store
    public allSceneDynos(): DynoInst[] {
        return [this.root, this.currentScene!].concat(this.sceneObjects);
    }

    public getSceneDyno(): DynoInst {
        return this.currentScene!;
    }

    public add(dyno: DynoInst): void {
        this.sceneObjects.push(dyno);
    }
}
