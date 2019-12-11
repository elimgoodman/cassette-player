import _ from "lodash";

import { LineFaceConfig, DynamicFaceConfig, FaceConfig } from "./cassette-def";
import { CommonVariable, DynamicObjectInst, GameState } from "./game-state";
import { MethodContextMaker } from "./method-context";
import { AssetManager } from "./asset-manager";

export class Renderer {
    private state: GameState;
    private methodContextMaker: MethodContextMaker;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(
        state: GameState,
        canvas: HTMLCanvasElement,
        assetManager: AssetManager
    ) {
        this.state = state;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.methodContextMaker = new MethodContextMaker(state, assetManager);
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private renderLine(face: LineFaceConfig, x: number, y: number): void {
        const [xLength, yLength] = face.length;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineWidth = face.width;
        this.ctx.lineTo(x + xLength, y + yLength);
        this.ctx.strokeStyle = face.color;
        this.ctx.stroke();
    }

    private renderDynamic(dynObj: DynamicObjectInst) {
        const { generator } = dynObj.face as DynamicFaceConfig;
        const faceConfig = generator(this.methodContextMaker.make(dynObj));
        this.renderObjUsingFace(dynObj, faceConfig);
    }

    private renderObjUsingFace(dynObj: DynamicObjectInst, face: FaceConfig) {
        switch (face.type) {
            case "line":
                this.renderLine(
                    face,
                    MethodContextMaker.getVariable({
                        path: CommonVariable.X,
                        object: dynObj,
                    }),
                    MethodContextMaker.getVariable({
                        path: CommonVariable.X,
                        object: dynObj,
                    })
                );
                break;
            case "dynamic":
                this.renderDynamic(dynObj);
                break;
            default:
                console.log(`Unimplemented face type: ${face!.type}`);
        }
    }

    public render() {
        const isRenderable = (dynObj: DynamicObjectInst) =>
            !_.isUndefined(dynObj.face);
        const dynObjs = this.state.filterSceneObjects(isRenderable);

        this.clear();

        dynObjs.forEach(dynObj => {
            const { face } = dynObj;
            this.renderObjUsingFace(dynObj, face!);
        });
    }
}
