import _ from "lodash";
import { AssetManager } from "./asset-manager";
import {
    ImageFaceConfig,
    LineFaceConfig,
    SquareFaceConfig,
} from "./cassette-def";
import { FaceConfigResolver } from "./face-config-resolver";
import { DynamicObjectInst, GameState } from "./game-state";
import { getCommonVars } from "./util";

interface RenderDetails {
    x: number;
    y: number;
    scale: number;
}

export class Renderer {
    private state: GameState;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private assetManager: AssetManager;
    private faceConfigResolver: FaceConfigResolver;

    public static isRenderable = (dynObj: DynamicObjectInst) =>
        !_.isUndefined(dynObj.face);

    constructor(canvas: HTMLCanvasElement) {
        this.state = GameState.getInstance();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.assetManager = AssetManager.getInstance();
        this.faceConfigResolver = FaceConfigResolver.getInstance();
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
        this.ctx.fillRect(x, y, length, length);
    }

    // TODO: this is prob unnecessary given the helper that's in util
    private makeRenderDetails(dynObj: DynamicObjectInst): RenderDetails {
        return getCommonVars(dynObj);
    }

    private renderFace(dynObj: DynamicObjectInst) {
        const details = this.makeRenderDetails(dynObj);
        const face = this.faceConfigResolver.resolveFaceConfig(dynObj)!;

        switch (face.type) {
            case "line":
                this.renderLine(face, details);
                break;
            case "image":
                this.renderImage(face, details);
                break;
            case "square":
                this.renderSquare(face, details);
                break;
            default:
                console.log(`Unimplemented face type: ${face!.type}`);
        }
    }

    public render() {
        const dynObjs = this.state.filterSceneObjects(Renderer.isRenderable);

        this.clear();

        dynObjs.forEach(dynObj => {
            this.renderFace(dynObj);
        });
    }
}
