import { DynamicObjectInst } from "./game-state";

interface DynamicObjectDef {
    variables?: Variable[];
    events?: EventHandler[];
    helpers?: Helper[];
}

interface Helper {
    id: string;
    handler: ($ctx: MethodContext) => any; // TODO: what context goes in here?
}

interface Controller {
    id: string;
    type: "mouse" | "keyboard" | "gamepad";
}

export interface LineFaceConfig {
    type: "line";
    length: [number, number];
    color: string;
    width: number;
}

type Color = string;

export interface DynamicFaceConfig {
    type: "dynamic";
    generator: ($ctx: MethodContext) => FaceConfig; // TODO: define this return type
}

export interface DynamicTextFaceConfig {
    type: "dynamic-text";
    fontSize: number;
    color: Color;
    generator: ($ctx: MethodContext) => string;
}

export interface ImageFaceConfig {
    type: "image";
    assetId: string;
}

export type FaceConfig =
    | LineFaceConfig
    | DynamicFaceConfig
    | ImageFaceConfig
    | DynamicTextFaceConfig;

export type GameObject = {
    id: string;
    face: FaceConfig;
    assets?: AssetDef[];
} & DynamicObjectDef;

export type Scene = {
    id: string;
    gameObjects: GameObject[];
} & DynamicObjectDef;

export interface Variable {
    name: string;
    type: "int" | "float" | "string" | "list" | "map" | "matrix";
    value: any;
}

export interface Event {
    eventName: string;
    metadata?: any;
    payload?: any;
}

export type EventHandlerCallback = ($event: Event, $ctx: MethodContext) => void;
export interface EventHandler {
    event: "tick" | "keydown" | "click" | string;
    handler: EventHandlerCallback; // TODO: what context goes in here?
}

export type CassetteDef = {
    controllers: Controller[];
    scenes: Scene[];
    defaultSceneId: string;
} & DynamicObjectDef;

export interface AssetDef {
    id: string;
    path: string;
}

type Target = DynamicObjectInst | DynamicObjectInst[];

export interface GetVariableArgs {
    object: DynamicObjectInst;
    path: string;
    badge?: string;
}

export interface SetVariableArgs {
    object: DynamicObjectInst;
    path: string;
    value: any;
    badge?: string;
}

interface Actions {
    getVariable: (args: GetVariableArgs) => any;
    fireEvent: (args: {
        target: Target;
        eventName: string;
        payload: any;
    }) => any;
    setVariable: (args: SetVariableArgs) => void;
    updateVariable: (args: {
        object: DynamicObjectInst;
        path: string;
        updater: (val: any) => any;
        badge?: string;
    }) => void;
    goToScene: (args: { sceneId: string; variables?: any }) => void;
}

interface FaceHelpers {
    square: (args: { length: number; color: Color }) => any;
    image: (args: { assetId: string }) => ImageFaceConfig;
}

export interface MethodContext {
    actions: Actions;
    self: DynamicObjectInst;
    helpers: any;
    faces: FaceHelpers;
    currentScene: DynamicObjectInst;
}
