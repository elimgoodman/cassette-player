import _ from "lodash";

import { Event, MethodContext } from "./cassette-def";
import { DynamicObjectInst, GameState } from "./game-state";
import { MethodContextMaker } from "./method-context";
import { AssetManager } from "./asset-manager";

export class EventDispatcher {
    static TICK_EVENT: Event = {
        eventName: "tick",
    };

    private state: GameState;
    private methodContextMaker: MethodContextMaker;

    constructor(state: GameState, assetManager: AssetManager) {
        this.state = state;
        this.methodContextMaker = new MethodContextMaker(state, assetManager);
    }

    public dispatch(event: Event): void {
        const objs = this.getObjsThatHandle(event);
        objs.forEach(obj => {
            const handler = obj.eventHandlers[event.eventName]!;
            handler(event, this.methodContextMaker.make(obj));
        });
    }

    // TODO: this is cacheable if it becomes expensive
    private getObjsThatHandle(event: Event): DynamicObjectInst[] {
        return this.state.filterSceneObjects(dynObj => {
            return _.has(dynObj.eventHandlers, event.eventName);
        });
    }
}
