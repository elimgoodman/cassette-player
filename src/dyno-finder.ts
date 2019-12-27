import _ from "lodash";
import { DynoManager } from "./dyno-manager";
import { DynoInst } from "./game-state";

export class DynoFinder {
    private dynoManager: DynoManager;
    private static instance: DynoFinder;
    private constructor() {
        this.dynoManager = DynoManager.getInstance();
    }

    public static getInstance(): DynoFinder {
        if (!DynoFinder.instance) {
            DynoFinder.instance = new DynoFinder();
        }

        return DynoFinder.instance;
    }

    public getById(id: string): DynoInst | undefined {
        // FIXME: also this is almost definitely terrible perf-wise!
        return _.find(this.dynoManager.allSceneDynos(), obj => obj.id === id);
    }

    public filter(pred: (obj: DynoInst) => boolean): DynoInst[] {
        return this.dynoManager.allSceneDynos().filter(pred);
    }
}
