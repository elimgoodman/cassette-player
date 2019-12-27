import _ from "lodash";
import { Event } from "./cassette-def";
import { DynoManager } from "./dyno-manager";
import { DynoInst } from "./game-state";
import { MethodContextMaker } from "./method-context";

export class EventDispatcher {
    static TICK_EVENT: Event = {
        eventName: "tick",
    };

    private dynoManager: DynoManager;
    private methodContextMaker: MethodContextMaker;

    private static instance: EventDispatcher;

    static getInstance() {
        if (!EventDispatcher.instance) {
            EventDispatcher.instance = new EventDispatcher();
        }

        return EventDispatcher.instance;
    }

    private constructor() {
        this.methodContextMaker = MethodContextMaker.getInstance();
        this.dynoManager = DynoManager.getInstance();
    }

    public dispatch(event: Event): void {
        const objs = this.getObjsThatHandle(event);
        objs.forEach(obj => {
            const handler = obj.eventHandlers[event.eventName]!;
            handler(event, this.methodContextMaker.make(obj));
        });
    }

    // TODO: this is cacheable if it becomes expensive
    private getObjsThatHandle(event: Event): DynoInst[] {
        return this.getTargets(event).filter(dynObj => {
            return _.has(dynObj.eventHandlers, event.eventName);
        });
    }

    private getTargets(event: Event): DynoInst[] {
        if (_.isArray(event.target)) {
            return event.target;
        } else if (!_.isNil(event.target)) {
            return [event.target];
        }

        return this.dynoManager.allSceneDynos();
    }
}
