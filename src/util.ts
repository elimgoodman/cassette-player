import { CommonVariable, DynamicObjectInst } from "./game-state";
import { MethodContextMaker } from "./method-context";

export interface CommonVars {
    x: number;
    y: number;
    scale: number;
}

export function getCommonVars(dyno: DynamicObjectInst): CommonVars {
    return {
        x: MethodContextMaker.getVariable({
            path: CommonVariable.X,
            object: dyno,
        }),
        y: MethodContextMaker.getVariable({
            path: CommonVariable.X,
            object: dyno,
        }),
        scale: MethodContextMaker.getVariable({
            path: CommonVariable.SCALE,
            object: dyno,
        }),
    };
}
