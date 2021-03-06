import { AssetManager } from "./asset-manager";
import { DynoFinder } from "./dyno-finder";
import { FaceConfigResolver } from "./face-config-resolver";
import { DynoInst } from "./game-state";
import { Renderer } from "./renderer";
import { getCommonVars } from "./util";

interface Rect {
    x: number;
    y: number;
    height: number;
    width: number;
}

export class CollisionDetector {
    private faceConfigResolver: FaceConfigResolver;
    private assetManager: AssetManager;
    private dynoFinder: DynoFinder;

    private static instance: CollisionDetector;

    private constructor() {
        this.faceConfigResolver = FaceConfigResolver.getInstance();
        this.assetManager = AssetManager.getInstance();
        this.dynoFinder = DynoFinder.getInstance();
    }

    public static getInstance() {
        if (!CollisionDetector.instance) {
            CollisionDetector.instance = new CollisionDetector();
        }

        return CollisionDetector.instance;
    }

    public getObjectsAtPoint(x: number, y: number): DynoInst[] {
        const dynos = this.dynoFinder.filter(Renderer.isRenderable);

        // FIXME: I know this is super inefficient! Cache this!
        return dynos.filter(dyno => {
            const rect = this.getBoundingRect(dyno);
            return rect && this.rectContains(rect, x, y);
        });
    }

    private rectContains(rect: Rect, x: number, y: number): boolean {
        return (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );
    }

    private getBoundingRect(dyno: DynoInst): Rect | null {
        const face = this.faceConfigResolver.resolveFaceConfig(dyno);
        const { x, y } = getCommonVars(dyno);

        switch (face?.type) {
            case "image":
                const { width, height } = this.assetManager.getById(
                    face.assetId
                );
                return { x, y, width, height };
            case "square":
                const { length } = face;
                return { x, y, width: length, height: length };
            default:
                return null;
        }
    }
}
