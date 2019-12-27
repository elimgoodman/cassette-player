import _ from "lodash";
import { CassetteDef, SceneDef } from "./cassette-def";
import { CassetteLibrary } from "./cassette-library";
import { DynoManager } from "./dyno-manager";
import { MethodContextMaker } from "./method-context";

export class SceneManager {
    private currentCassette: CassetteDef;
    public currentScene: SceneDef | null = null;

    private dynoManager: DynoManager;
    private static instance: SceneManager;

    private constructor() {
        this.currentCassette = CassetteLibrary.getInstance().getCurrentCassette();
        this.dynoManager = DynoManager.getInstance();

        this.goToScene(this.currentCassette.defaultSceneId);
    }

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }

        return SceneManager.instance;
    }

    public getSceneById(sceneId: string): SceneDef | undefined {
        const { scenes } = this.currentCassette;
        return _.find(scenes, sceneDef => sceneDef.id === sceneId);
    }

    public goToScene(sceneId: string, variables?: any): void {
        const scene = this.getSceneById(sceneId);
        if (!scene) return;

        this.currentScene = scene;
        this.dynoManager.addAllForScene(scene);

        // TODO: this is kinda gross but whatever
        if (variables) {
            const sceneDyno = this.dynoManager.getSceneDyno();

            _.each(variables, (value, path) => {
                MethodContextMaker.setVariable({
                    object: sceneDyno,
                    path,
                    value,
                });
            });
        }
    }
}
