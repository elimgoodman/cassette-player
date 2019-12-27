import { DynoFinder } from "./dyno-finder";
import { DynoInst, HelperCallback } from "./game-state";

interface DynoDef {
    variables?: Variable[];
    events?: EventHandler[];
    helpers?: Helper[];
    badges?: Badge[];
}

export interface Helper {
    id: string;
    handler: HelperCallback;
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
    generator: ($ctx: MethodContext) => RenderableFaceConfig;
}

export interface DynamicTextFaceConfig {
    type: "dynamic-text";
    fontSize: number; // TODO: maybe refactor this out, what with TextFaceConfig below....
    color: Color;
    generator: ($ctx: MethodContext) => string;
}

export interface ImageFaceConfig {
    type: "image";
    assetId: string;
}

export interface SquareFaceConfig {
    type: "square";
    length: number;
    color: Color;
}

export interface RectFaceConfig {
    type: "rect";
    width: number;
    height: number;
    color: Color;
}

export interface TextFaceConfig {
    type: "text";
    color: Color;
    text: string;
    fontSize: number;
}

export type RenderableFaceConfig =
    | LineFaceConfig
    | ImageFaceConfig
    | TextFaceConfig
    | RectFaceConfig
    | SquareFaceConfig;

export type FaceConfig =
    | RenderableFaceConfig
    | DynamicFaceConfig
    | DynamicTextFaceConfig;

export type GameObject = {
    id: string;
    face: FaceConfig;
    assets?: AssetDef[];
} & DynoDef;

export type SceneDef = {
    id: string;
    gameObjects: GameObject[];
} & DynoDef;

export interface Variable {
    name: string;
    value: any;
}

export interface Event {
    eventName: string;
    target?: Target;
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
    scenes: SceneDef[];
    defaultSceneId: string;
} & DynoDef;

export interface AssetDef {
    id: string;
    path: string;
}

type Target = DynoInst | DynoInst[];

export interface GetVariableArgs {
    object: DynoInst;
    path: string;
    badge?: string;
}

export interface SetVariableArgs {
    object: DynoInst;
    path: string;
    value: any;
    badge?: string;
}

export interface GoToSceneArgs {
    sceneId: string;
    variables?: any;
}

interface Actions {
    getVariable: (args: GetVariableArgs) => any;
    fireEvent: (event: Event) => any;
    setVariable: (args: SetVariableArgs) => void;
    updateVariable: (args: {
        object: DynoInst;
        path: string;
        updater: (val: any) => any;
        badge?: string;
    }) => void;
    goToScene: (args: GoToSceneArgs) => void;
}

export interface SquareFaceArgs {
    length: number;
    color: Color;
}

interface FaceHelpers {
    square: (args: SquareFaceArgs) => SquareFaceConfig;
    image: (args: { assetId: string }) => ImageFaceConfig;
}

export interface MethodContext {
    actions: Actions;
    self: DynoInst;
    helpers: any;
    faces: FaceHelpers;
    currentScene: DynoInst;
    dynos: DynoFinder;
}

// FIXME: this is the exact same as DynoDef...
export interface Badge {
    id: string;
    variables?: Variable[];
    events?: EventHandler[];
    helpers?: Helper[];
}
