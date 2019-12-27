import {
    EventHandlerCallback,
    FaceConfig,
    MethodContext,
} from "./cassette-def";

export enum CommonVariable {
    X = "x",
    Y = "y",
    SCALE = "scale",
}

export type HelperCallback = ($ctx: MethodContext) => void;

export type Variables = { [key: string]: any };
export type EventHandlers = { [eventName: string]: EventHandlerCallback };
export type Helpers = { [name: string]: HelperCallback };

export interface DynoInst {
    id: string;
    uuid: string;
    variables: Variables;
    eventHandlers: EventHandlers;
    helpers: Helpers;
    face?: FaceConfig;
}
