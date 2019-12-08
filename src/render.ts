import { GameState, DynamicObject, CommonVariable } from "./game-state";
import { LineFaceConfig } from "./cassette-def";

function clear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderLine(
    ctx: CanvasRenderingContext2D,
    dynObj: DynamicObject
): void {
    const face = dynObj.face as LineFaceConfig;

    // FIXME: I'm sure I'll add some slicker way of getting variables,
    // but this works for now

    const x = dynObj.variables[CommonVariable.X];
    const y = dynObj.variables[CommonVariable.Y];

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = face.width;
    ctx.lineTo(...face.length);
    ctx.strokeStyle = face.color;
    ctx.stroke();
}

export function render(state: GameState, canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d")!;
    const dynObjs = state.getRenderableObjects();

    clear(canvas, context);

    dynObjs.forEach(dynObj => {
        const { face } = dynObj;
        switch (face!.type) {
            case "line":
                renderLine(context, dynObj);
                break;
            default:
                console.log(`Unimplemented face type: ${face!.type}`);
        }
    });
}
