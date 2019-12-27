import { RenderableFaceConfig } from "./cassette-def";
import { DynoInst } from "./game-state";
import { MethodContextMaker } from "./method-context";

export class FaceConfigResolver {
    private contextMaker: MethodContextMaker;
    private static instance: FaceConfigResolver;
    private constructor() {
        this.contextMaker = MethodContextMaker.getInstance();
    }
    public static getInstance(): FaceConfigResolver {
        if (!FaceConfigResolver.instance) {
            FaceConfigResolver.instance = new FaceConfigResolver();
        }

        return FaceConfigResolver.instance;
    }

    public resolveFaceConfig(dyno: DynoInst): RenderableFaceConfig | null {
        const { face } = dyno;
        if (!face) {
            return null;
        }

        switch (face.type) {
            case "dynamic":
                const { generator } = face;
                return generator(this.contextMaker.make(dyno));
            default:
                return face as RenderableFaceConfig;
        }
    }
}
