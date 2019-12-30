import { GameObject } from "./cassette-def";
import { CassetteLibrary } from "./cassette-library";

export class PrefabManager {
    private prefabs: Map<string, GameObject> = new Map();
    private static instance: PrefabManager;
    private constructor() {
        this.loadPrefabs();
    }

    public static getInstance(): PrefabManager {
        if (!PrefabManager.instance) {
            PrefabManager.instance = new PrefabManager();
        }

        return PrefabManager.instance;
    }

    private loadPrefabs() {
        CassetteLibrary.getInstance()
            .getCurrentCassette()
            .prefabs?.forEach(gameObject => {
                this.prefabs.set(gameObject.id, gameObject);
            });
    }

    public getById(id: string): GameObject | undefined {
        return this.prefabs.get(id);
    }
}
