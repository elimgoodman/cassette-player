import _ from "lodash";
import { Event } from "./cassette-def";
import { DynoManager } from "./dyno-manager";
import { DynoInst, EventHandlers } from "./game-state";
import { MethodContextMaker } from "./method-context";

export class EventDispatcher {
    static TICK_EVENT: Event = {
        eventName: "tick",
    };

    private dynoManager: DynoManager;
    // private methodContextMaker: MethodContextMaker;

    private static instance: EventDispatcher;

    static getInstance() {
        if (!EventDispatcher.instance) {
            EventDispatcher.instance = new EventDispatcher();
        }

        return EventDispatcher.instance;
    }

    private constructor() {
        // this.methodContextMaker = MethodContextMaker.getInstance();
        this.dynoManager = DynoManager.getInstance();
    }

    public dispatch(event: Event): void {
        const objs = this.getObjsThatHandle(event);
        objs.forEach(obj => {
            const handler = this.gatherHandlers(obj)[event.eventName]!;
            handler(event, MethodContextMaker.getInstance().make(obj));
        });
    }

    // TODO: this is cacheable if it becomes expensive
    private getObjsThatHandle(event: Event): DynoInst[] {
        // console.log(event);
        // console.log(this.getTargets(event));
        return this.getTargets(event).filter(dyno => {
            const handlers = this.gatherHandlers(dyno);
            return _.has(handlers, event.eventName);
        });
    }

    // TODO: also very cacheable!
    private gatherHandlers(dyno: DynoInst): EventHandlers {
        let { eventHandlers } = dyno;
        if (dyno.badges) {
            _.each(dyno.badges, (badge, id) => {
                _.merge(eventHandlers, badge.eventHandlers);
            });
        }

        return eventHandlers;
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
