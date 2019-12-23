import _ from "lodash";

import {
    LineFaceConfig,
    DynamicFaceConfig,
    FaceConfig,
    ImageFaceConfig,
    SquareFaceConfig,
} from "./cassette-def";
import { CommonVariable, DynamicObjectInst, GameState } from "./game-state";
import { MethodContextMaker } from "./method-context";
import { AssetManager } from "./asset-manager";
import { clearLine } from "readline";

interface RenderDetails {
    x: number;
    y: number;
    scale: number;
}

export class Renderer {
    private state: GameState;
    private methodContextMaker: MethodContextMaker;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private assetManager: AssetManager;

    constructor(canvas: HTMLCanvasElement) {
        this.state = GameState.getInstance();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.methodContextMaker = MethodContextMaker.getInstance();
        this.assetManager = AssetManager.getInstance();
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private renderLine(face: LineFaceConfig, details: RenderDetails): void {
        const { x, y } = details;
        const [xLength, yLength] = face.length;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineWidth = face.width;
        this.ctx.lineTo(x + xLength, y + yLength);
        this.ctx.strokeStyle = face.color;
        this.ctx.stroke();
    }

    private renderDynamic(face: DynamicFaceConfig, dynObj: DynamicObjectInst) {
        const { generator } = face;
        const generatedFace = generator(this.methodContextMaker.make(dynObj));
        this.renderFace(generatedFace, dynObj);
    }

    private renderImage(face: ImageFaceConfig, details: RenderDetails) {
        const { x, y, scale } = details;
        const asset = this.assetManager.getById(face.assetId);
        this.ctx.drawImage(
            asset,
            x,
            y,
            asset.width * scale,
            asset.height * scale
        );
    }

    private renderSquare(face: SquareFaceConfig, details: RenderDetails) {
        // TODO: implement scale for squares
        const { x, y } = details;
        const { color, length } = face;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, x + length, y + length);
    }

    private makeRenderDetails(dynObj: DynamicObjectInst): RenderDetails {
        return {
            x: MethodContextMaker.getVariable({
                path: CommonVariable.X,
                object: dynObj,
            }),
            y: MethodContextMaker.getVariable({
                path: CommonVariable.X,
                object: dynObj,
            }),
            scale: MethodContextMaker.getVariable({
                path: CommonVariable.SCALE,
                object: dynObj,
            }),
        };
    }

    private renderFace(face: FaceConfig, dynObj: DynamicObjectInst) {
        const details = this.makeRenderDetails(dynObj);
        switch (face.type) {
            case "line":
                this.renderLine(face, details);
                break;
            case "image":
                this.renderImage(face, details);
                break;
            case "dynamic":
                this.renderDynamic(face, dynObj);
                break;
            case "square":
                this.renderSquare(face, details);
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
            this.renderFace(face!, dynObj);
        });
    }
}
