interface DynamicObject {
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

interface ShapeFaceConfig {
    type: "line";
    length: [number, number];
    color: string;
    width: number;
}

type Color = string;

interface DynamicFaceConfig {
    type: "dynamic";
    generator: ($ctx: MethodContext) => any; // TODO: define this return type
}

interface DynamicTextFaceConfig {
    type: "dynamic-text";
    fontSize: number;
    color: Color;
    generator: ($ctx: MethodContext) => string;
}

export type FaceConfig =
    | ShapeFaceConfig
    | DynamicFaceConfig
    | DynamicTextFaceConfig;

export type GameObject = {
    id: string;
    face: FaceConfig;
} & DynamicObject;

export type Scene = {
    id: string;
    gameObjects: GameObject[];
} & DynamicObject;

export interface Variable {
    name: string;
    type: "int" | "float" | "string" | "list" | "map" | "matrix";
    value: any;
}

interface Event {
    eventName: string;
    metadata: any;
    payload: any;
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
} & DynamicObject;

type Asset = any;
type Target = DynamicObject | DynamicObject[];

interface Actions {
    getVariable: (args: {
        object: DynamicObject;
        path: string;
        badge?: string;
    }) => any;
    fireEvent: (args: {
        target: Target;
        eventName: string;
        payload: any;
    }) => any;
    setVariable: (args: {
        object: DynamicObject;
        path: string;
        value: any;
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
    self: DynamicObject;
    helpers: any;
    assets: AssetHelpers;
    shapes: ShapeHelpers;
    currentScene: Scene;
}
