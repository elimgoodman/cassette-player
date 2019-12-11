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
    generator: ($ctx: MethodContext) => any; // TODO: define this return type
}

export interface DynamicTextFaceConfig {
    type: "dynamic-text";
    fontSize: number;
    color: Color;
    generator: ($ctx: MethodContext) => string;
}

export type FaceConfig =
    | LineFaceConfig
    | DynamicFaceConfig
    | DynamicTextFaceConfig;

export type GameObject = {
    id: string;
    face: FaceConfig;
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

type Asset = any;
type Target = DynamicObjectInst | DynamicObjectInst[];

interface Actions {
    getVariable: (args: {
        object: DynamicObjectInst;
        path: string;
        badge?: string;
    }) => any;
    fireEvent: (args: {
        target: Target;
        eventName: string;
        payload: any;
    }) => any;
    setVariable: (args: {
        object: DynamicObjectInst;
        path: string;
        value: any;
        badge?: string;
    }) => void;
    updateVariable: (args: {
        object: DynamicObjectInst;
        path: string;
        updater: (val: any) => any;
        badge?: string;
    }) => void;
    goToScene: (args: { sceneId: string; variables?: any }) => void;
}

interface AssetHelpers {
    getById(args: { id: string }): Asset;
}

// FIXME: what relationship should this have to FaceConfig?
// TODO: have some kind of color type
interface ShapeHelpers {
    square: (args: { length: number; color: string }) => any;
}

export interface MethodContext {
    actions: Actions;
    self: DynamicObjectInst;
    helpers: any;
    assets: AssetHelpers;
    shapes: ShapeHelpers;
    currentScene: DynamicObjectInst;
}
