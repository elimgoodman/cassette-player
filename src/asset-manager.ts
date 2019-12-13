import { CassetteDef, AssetDef } from "./cassette-def";

type LoadedAsset = HTMLImageElement;

export class AssetManager {
    private static instance: AssetManager;
    private static cassetteDef: CassetteDef;
    private loadedAssets: { [id: string]: LoadedAsset } = {};

    static init(cassetteDef: CassetteDef) {
        AssetManager.cassetteDef = cassetteDef;
    }

    static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }

        return AssetManager.instance;
    }

    private constructor() {}

    public getById(id: string): LoadedAsset {
        return this.loadedAssets[id];
    }

    public async loadAll(): Promise<void> {
        return new Promise(resolve => {
            // TODO: this is a little janky but it gets the job done...
            const assetDefs = this.collectAssetDefs();
            let loaded = 0;
            const onLoaded = () => {
                loaded++;
                if (loaded === assetDefs.length) {
                    resolve();
                }
            };

            // FIXME: generalize for more asset types
            assetDefs.forEach(assetDef => {
                const img = new Image();
                img.src = assetDef.path;
                img.onload = onLoaded;

                this.loadedAssets[assetDef.id] = img;
            });
        });
    }

    private collectAssetDefs(): AssetDef[] {
        let assetDefs: AssetDef[] = [];
        AssetManager.cassetteDef.scenes.forEach(scene => {
            scene.gameObjects.forEach(gameObj => {
                if (gameObj.assets) {
                    assetDefs = assetDefs.concat(gameObj.assets);
                }
            });
        });

        return assetDefs;
    }
}
