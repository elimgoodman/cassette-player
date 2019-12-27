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

        const ctx = this.contextMaker.make(dyno);
        switch (face.type) {
            case "dynamic":
                return face.generator(ctx);
            case "dynamic-text":
                const text = face.generator(ctx);
                return {
                    ...face,
                    type: "text",
                    text,
                };
            default:
                return face;
        }
    }
}
